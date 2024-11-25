pipeline {
    agent any
    environment {
        SLACK_CREDENTIALS = 'Slack-Integration'
        SLACK_CHANNEL = '#jenkins-notifications'
        GIT_CREDENTIALS = 'GitHub-souzi'
        DOCKER_REPO = 'suzy90/reading-recommendations'
    }
    stages {
        stage('Initialize') {
            steps {
                slackSend channel: SLACK_CHANNEL, color: 'warning',
                    message: "Build Started: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\n(${env.BUILD_URL})",
                    notifyCommitters: true, tokenCredentialId: SLACK_CREDENTIALS
            }
        }
        stage('Checkout') {
            steps {
                script {
                    retry(3){
                        checkout scm
                    }
                }
            }
        }
        stage('Install & Test') {
            parallel {
                stage('Install Dependencies') {
                    steps {
                        withCredentials([string(credentialsId: 'ENV_TESTING', variable: 'ENV_TESTING')]) {
                            writeFile file: '.env.testing', text: "${ENV_TESTING}\n"
                        }
                        nodejs('node-18') {
                            cache(maxCacheSize: 250, defaultBranch: 'master', caches: [
                                arbitraryFileCache(path: 'node_modules', cacheValidityDecidingFile: 'package-lock.json')
                            ]) {
                                sh 'npm install'
                            }
                        }
                    }
                }
                stage('Run Tests') {
                    steps {
                        withCredentials([string(credentialsId: 'ENV_TESTING', variable: 'ENV_TESTING')]) {
                            writeFile file: '.env.testing', text: "${ENV_TESTING}\n"
                        }
                        nodejs('node-18') {
                            sh 'npm test -- --onlyChanged'
                        }
                    }
                }
            }
        }
        stage('Build & Publish Docker Image') {
            when {
                allOf {
                    branch 'master'
                    expression { currentBuild.result != 'FAILURE' }
                }
            }
            steps {
                withCredentials([string(credentialsId: 'ENV_PRODUCTION', variable: 'ENV_PROD')]) {
                    writeFile file: '.env.production', text: "${ENV_PROD}\n"
                }
                withCredentials([usernamePassword(credentialsId: 'docker-hub-repo', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                    // sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                    retry(3) {
                        sh '''
                            echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin
                        '''
                    }
                }
                sh '''
                    #!/bin/bash
                    docker build --cache-from=${DOCKER_REPO}:latest -t ${DOCKER_REPO}:${BUILD_NUMBER} .
                    docker tag ${DOCKER_REPO}:${BUILD_NUMBER} ${DOCKER_REPO}:latest
                    docker push ${DOCKER_REPO}:${BUILD_NUMBER}
                    docker push ${DOCKER_REPO}:latest
                '''
            }
        }
        stage('Deploy') {
            steps {
                timeout(activity: true, time: 10) {
                    slackSend channel: SLACK_CHANNEL, message: '@channel Kindly approve or decline the manual trigger'
                    input message: 'Do you want to deploy?', ok: 'Deploy'
                    slackSend channel: SLACK_CHANNEL, message: '@channel Thanks for Approval'
                }
                sh 'ansible --version'
                sh 'ansible-inventory -i ansible/inventory/localhost.ini --list'
                ansiblePlaybook(
                    playbook: 'ansible/app-deploy.yml',
                    inventory: 'ansible/inventory/localhost.ini',
                    colorized: true,
                    extraVars: ['build_number': 'latest']
                )
                sshagent(credentials: ['jenkins_private_key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no jenkins@172.29.0.2 "
                            docker ps -a --filter 'name=reading-recommendations*' -q | xargs -r docker stop &&
                            docker ps -a --filter 'name=reading-recommendations*' -q | xargs -r docker rm &&
                            docker run -d --name reading-recommendations-app -p 3000:3000 ${DOCKER_REPO}:latest
                        "
                    '''
                }
            }
        }

        stage('Test Deployment') {
            steps {
                script {
                    // Run health check using curl
                    def result = sh(script: "curl -f https://d587409ef403c02993dae6f819823e44.serveo.net/api/v1/health", returnStatus: true)
                    if (result != 0) {
                        error("Health check failed! Application not running as expected.")
                    }
                }
            }
        }
    }
    post {
        success {
            slackSend channel: SLACK_CHANNEL, color: 'good',
                message: "Build Succeeded: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\n(${env.BUILD_URL})",
                notifyCommitters: true, tokenCredentialId: SLACK_CREDENTIALS
        }
        failure {
            slackSend channel: SLACK_CHANNEL, color: 'danger',
                message: "Build Failed: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\n(${env.BUILD_URL})",
                notifyCommitters: true, tokenCredentialId: SLACK_CREDENTIALS
        }
    }
}
