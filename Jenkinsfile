pipeline {
    agent any
    environment {
        SLACK_CREDENTIALS = 'Slack-Integration'
        SLACK_CHANNEL = '#jenkins-notifications'
        GIT_CREDENTIALS = 'GitHub-souzi'
        DOCKER_REPO = 'suzy90/reading-recommendations'
    }
    stages {
        stage('Master Branch') {
            stages {
                // stage('Git Checkout') {
                //     steps {
                //         slackSend channel: SLACK_CHANNEL, color: 'warning', message: "Build Started: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\n(${env.BUILD_URL})", notifyCommitters: true, tokenCredentialId: SLACK_CREDENTIALS
                //         git credentialsId: GIT_CREDENTIALS, url: 'https://github.com/souzi-nada/reading-recommendations'
                //     }
                // }
                // stage('Git Checkout') {
                //     steps {
                //         slackSend channel: SLACK_CHANNEL, color: 'warning', message: "Build Started: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\n(${env.BUILD_URL})", notifyCommitters: true, tokenCredentialId: SLACK_CREDENTIALS
                //         git credentialsId: GIT_CREDENTIALS, url: 'https://github.com/souzi-nada/reading-recommendations'
                //     }
                // }
                // stage('Git Checkout') {
                //     steps {
                //         slackSend channel: SLACK_CHANNEL, color: 'warning', message: "Build Started: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\n(${env.BUILD_URL})", notifyCommitters: true, tokenCredentialId: SLACK_CREDENTIALS
                //         git credentialsId: GIT_CREDENTIALS, url: 'https://github.com/souzi-nada/reading-recommendations'
                //     }
                // }
                // stage('Build') {
                //     steps {
                //         withCredentials([string(credentialsId: 'ENV_DEVELOPMENT', variable: 'ENV_DEV')]) {
                //             sh ' echo "${ENV_DEV}" >> .env.development'
                //         }
                //         nodejs('node-18') {
                //           sh 'npm install'
                //         }
                //     }
                // }
                // stage('Testing App Phase') {
                //      steps {
                //         withCredentials([string(credentialsId: 'ENV_TESTING', variable: 'ENV_TESTING')]) {
                //             sh ' echo "${ENV_TESTING}" >> .env.testing'
                //         }
                //         script {
                //             try {
                //                 nodejs('node-18') {
                //                     sh 'npm install'
                //                     sh 'npm test'
                //                 }
                //             } catch (Exception e) {
                //                 currentBuild.result = 'FAILURE' // Mark build as failure
                //                 error("Tests failed: ${e}") // Stop the pipeline
                //             }
                //         }
                //     }
                // }
                // stage('Publish on DockerHub') {
                //     when {
                //         expression { env.BRANCH_NAME == 'master' }
                //         expression { currentBuild.result != 'FAILURE' }
                //     }
                //     steps {
                //         withCredentials([string(credentialsId: 'ENV_PRODUCTION', variable: 'ENV_PROD')]) {
                //             sh 'echo "${ENV_PROD}" >> .env.production'
                //         }
                //         withCredentials([usernamePassword(credentialsId: 'docker-hub-repo', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                //             sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                //             sh "docker build -t suzy90/reading-recommendations:${env.BUILD_NUMBER} ."
                //             sh "docker tag suzy90/reading-recommendations:${env.BUILD_NUMBER} suzy90/reading-recommendations:latest"
                //             sh "docker push suzy90/reading-recommendations:${env.BUILD_NUMBER}"
                //             sh 'docker push suzy90/reading-recommendations:latest'
                //         }
                //     }
                // }
                // stage('Testing App Phase') {
                //      steps {
                //         withCredentials([string(credentialsId: 'ENV_TESTING', variable: 'ENV_TESTING')]) {
                //             sh ' echo "${ENV_TESTING}" >> .env.testing'
                //         }
                //         script {
                //             try {
                //                 nodejs('node-18') {
                //                     sh 'npm install'
                //                     sh 'npm test'
                //                 }
                //             } catch (Exception e) {
                //                 currentBuild.result = 'FAILURE' // Mark build as failure
                //                 error("Tests failed: ${e}") // Stop the pipeline
                //             }
                //         }
                //     }
                // }
                // stage('Publish on DockerHub') {
                //     when {
                //         expression { env.BRANCH_NAME == 'master' }
                //         expression { currentBuild.result != 'FAILURE' }
                //     }
                //     steps {
                //         withCredentials([string(credentialsId: 'ENV_PRODUCTION', variable: 'ENV_PROD')]) {
                //             sh 'echo "${ENV_PROD}" >> .env.production'
                //         }
                //         withCredentials([usernamePassword(credentialsId: 'docker-hub-repo', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                //             sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                //             sh "docker build -t suzy90/reading-recommendations:${env.BUILD_NUMBER} ."
                //             sh "docker tag suzy90/reading-recommendations:${env.BUILD_NUMBER} suzy90/reading-recommendations:latest"
                //             sh "docker push suzy90/reading-recommendations:${env.BUILD_NUMBER}"
                //             sh 'docker push suzy90/reading-recommendations:latest'
                //         }
                //     }
                // }
                stage('Deploy App'){
                    steps {
                        timeout(activity: true, time: 10) {
                            slackSend channel: SLACK_CHANNEL, message: '@channel Kindly approve or decline the manual trigger'
                            input 'Do you want to deploy?'
                            slackSend channel: SLACK_CHANNEL, message: '@channel Thanks for Approval'
                        }
                        sh 'ansible --version'
                        sh 'ansible-inventory -i ansible/inventory/localhost.ini --list'
                        ansiblePlaybook(
                            playbook: 'ansible/app-deploy.yml',
                            inventory: 'ansible/inventory/localhost.ini',
                            colorized: true,
                            extraVars: [
                                'build_number': 'latest',
                            ]
                        )
                    }
                }
            }
        }
    }
    post {
        success {
            slackSend channel: SLACK_CHANNEL , color: 'good', message: "Build Succeeded: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\n(${env.BUILD_URL})", notifyCommitters: true, tokenCredentialId: SLACK_CREDENTIALS
        }
        failure {
            slackSend channel: SLACK_CHANNEL, color: 'danger', message: "Build Failed: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\n(${env.BUILD_URL})", notifyCommitters: true, tokenCredentialId: SLACK_CREDENTIALS
        }
    }
}
