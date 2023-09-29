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