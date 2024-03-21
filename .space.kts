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
    startOn { gitPush { enabled = false } }

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

    container(displayName = "Cleanup images","amazoncorretto:17-alpine") {
        kotlinScript { api ->
            api.space().projects.packages.repositories.cleanup.cleanupRepository(
                    project = ProjectIdentifier.Key("HUB-3-D"),
                    repository = PackageRepositoryIdentifier.Key("container-ci-hub3d-containers")
            )
        }
    }
}