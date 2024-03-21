job("Rubocop Linter") {

    startOn {
        gitPush {
            anyRefMatching {
                +"refs/merge/*/head"
            }
        }
    }

    container(displayName = "Rubocop", image = "ruby:3.1.3-slim") {
        shellScript {
            content = """
                echo Installing apt deps
                apt-get update -qq -y && apt-get install -y build-essential libpq-dev curl
                cd backend
                echo Installing gems
                bundle i
                echo Running rubocop
                bundle exec rubocop
            """
        }
    }
}

job("Deploy Staging") {
    // Only manual run
    startOn {}

    container("amazoncorretto:17-alpine") {
        kotlinScript { api ->
            api.space().projects.automation.deployments.start(
                    project = api.projectIdentifier(),
                    targetIdentifier = TargetIdentifier.Key("hub3d-staging"),
                    version = "ci-${api.executionNumber()}",
                    // automatically update deployment status based on a status of a job
                    syncWithAutomationJob = true
            )
        }
    }

    host("Build and push a Docker image") {
        dockerBuildPush {
            push = true
            context = "backend"
            file = "backend/Dockerfile"
            labels["branch"] = "${"$"}JB_SPACE_GIT_BRANCH"
            tags {
                // use current job run number as a tag - '0.0.run_number'
                +"gears.registry.jetbrains.space/p/hub-3-d/ci-hub3d-containers/backend:ci-${"$"}JB_SPACE_EXECUTION_NUMBER"
            }
        }
    }

    container(displayName = "Run deploy/staging-ci", image = "ubuntu") {
        env["IDRSA"] = "{{ project:bot-integration }}"
        // Duplicates vars with dockerBuildPush
        env["CI_REGISTRY"] = "gears.registry.jetbrains.space/p/hub-3-d/ci-hub3d-containers"
        env["CI_BACKEND_TAG"] = "ci-{{ run:number }}"

        shellScript {
            interpreter = "/bin/bash"
            location = "./integration/deploy/staging-ci.sh"
        }
    }

    parallel {

        container(displayName = "Cleanup images", "amazoncorretto:17-alpine") {
            kotlinScript { api ->
                api.space().projects.packages.repositories.cleanup.cleanupRepository(
                        project = ProjectIdentifier.Key("HUB-3-D"),
                        repository = PackageRepositoryIdentifier.Key("container-ci-hub3d-containers")
                )
            }
        }

        container(displayName = "Notify", image = "gradle:7.1-jre11") {
            kotlinScript { api ->
                // --- get deployment
                val projectId = api.projectId()
                val deploymentTarget = "hub3d-staging"

                val deployment = api.space().projects.automation.deployments.get(
                        project = ProjectIdentifier.Id(projectId),
                        targetIdentifier = TargetIdentifier.Key(deploymentTarget),
                        deploymentIdentifier = DeploymentIdentifier.Version("ci-${api.executionNumber()}")
                )

                val deploymentUrl = "${api.spaceUrl()}/p/${api.projectKey()}/deployments/targets/${deploymentTarget}/deployment/${deployment.id}"

                val deploymentTargetObj = api.space().projects.automation.deploymentTargets.get(
                        project = ProjectIdentifier.Id(projectId),
                        target = TargetIdentifier.Key(deploymentTarget)
                )

                val deploymentDescription = deploymentTargetObj.description

                // --- get review channel

                // That's awful but there is no run:review.id on code-review-opened for code review
                var reviewId = api.parameters["run:review.id"]
                        ?: api.parameters["run:trigger.code-review-opened.review.id"]

                // --- if reviewId is not set, try to first that contain commit
                if (reviewId.isNullOrBlank()) {
                    val data = api.space().projects.codeReviews.getAllCodeReviews(
                            project = ProjectIdentifier.Id(projectId)
                    ) {
                        review {
                            commits()
                            id()
                        }
                    }.data

                    val reviewObj = data.firstOrNull {
                        it.review.commits.any { commit -> commit.commitId == api.gitRevision() }
                    }

                    reviewId = reviewObj?.review?.id
                }

                if (reviewId.isNullOrBlank()) {
                    println("Didn't find any reviewId, no notify")
                    return@kotlinScript
                }

                reviewId = reviewId as String


                val reviewData = api.space().projects.codeReviews.getCodeReview(
                        project = ProjectIdentifier.Id(projectId),
                        reviewId = ReviewIdentifier.Id(reviewId)
                ) {
                    feedChannelId()
                }

                val feedChannelId = when (reviewData) {
                    is MergeRequestRecord -> reviewData.feedChannelId
                    is CommitSetReviewRecord -> reviewData.feedChannelId
                    else -> null
                }

                // --- post message to channel

                if (!feedChannelId.isNullOrBlank()) {
                    val channel = ChannelIdentifier.Id(feedChannelId)
                    val content = ChatMessage.Text("$deploymentUrl \n $deploymentDescription")
                    api.space().chats.messages.sendMessage(channel = channel, content = content)
                }
            }
        }

    }
}