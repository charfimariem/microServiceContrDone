pipeline {
    agent any
    environment {
        DOCKER_PATH = "C:\\Program Files\\Docker\\cli-plugins"
        PATH = "${DOCKER_PATH}:${PATH}"
        DOCKERHUB_CREDENTIALS = credentials('DockerHub')
        NODEJS_PATH = "C:\\Program Files (x86)\\nodejs"
    }
    tools {
        git 'Default' // Nom de l'installation Git configurée
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
                    bat "npm install express"
                    bat "npm install"
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
        stage('Build & rename Docker Image') {
            steps {
                script {
                    bat "docker build -t mariem293/appbackend:latest ."
                }
            }
        }
        stage('Deploy Docker image') {
            steps {
                script {
                    echo "Using DockerHub credentials ID: DockerHub"
                    docker.withRegistry('https://index.docker.io/v1/', 'DockerHub') {
                        docker.image('mariem293/appbackend:latest').push()
                    }
                }
            }
        }
        stage('Deploy with docker-compose ') {
            steps {
                script {
        
                    bat "docker-compose up"
                }
            }
        }
  
  }
}
