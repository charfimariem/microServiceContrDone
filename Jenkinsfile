
pipeline {
    agent any

    environment {
        DOCKER_PATH = "/usr/bin/docker"
        NODEJS_PATH = "/usr/bin/nodejs"
        PATH = "${DOCKER_PATH}:${NODEJS_PATH}:${PATH}"
        DOCKERHUB_CREDENTIALS = credentials('dockerhub') // Assurez-vous que les informations d'identification Docker Hub sont correctes
    }

    stages {
        stage('Install Node.js and npm') {
            steps {
                script {
                    def nodejs = tool name: 'NODEJS', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                    env.PATH = "${nodejs}/bin:${env.PATH}"
                }
            }
        }

        stage('Install express et Dependencies') {
            steps {
                script {
                    sh "npm install express"
                    sh "npm install"
                }
            }
        }

        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Build & tag Docker Image') {
            steps {
                script {
                    // Construire et marquer l'image Docker
                    sh "docker build -t mariem293/my-node-app ."
                    sh "docker tag my-node-app mariem293/my-node-app ." // Remplacez <image_id> par l'ID de l'image Docker construite
                }
            }
        }

        stage('Deploy Docker image') {
            steps {
                script {
                    // Déployer l'image Docker sur Docker Hub
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
                        docker.image('mariem293/my-node-app .').push()
                    }
                }
            }
        }

        stage('Deploy with docker-compose') {
            steps {
                script {
                    // Déployer avec docker-compose
                    sh "docker-compose up -d"
                }
            }
        }
    }
}
