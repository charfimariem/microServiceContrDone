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
        stage('Test with Jest') {
            steps {
                script {
                    bat "npm test"
                }
            }
        }
        stage('Run Postman tests') {
            steps {
                script {
                    // Ici, vous pouvez appeler Postman pour exécuter vos tests
                    // Assurez-vous que Postman est installé et configuré sur votre système
                    // Exemple d'exécution de tests Postman :
                    // newman run path/to/your/collection.json -e path/to/your/environment.json
                }
            }
        }
        stage('Run SonarQube analysis') {
            steps {
                script {
                    // Exécutez l'analyse SonarQube sur votre code
                    // Assurez-vous que SonarQube Scanner est configuré sur votre Jenkins
                    // Exemple :
                    // withSonarQubeEnv('SonarQubeServer') {
                    //     bat "sonar-scanner"
                    // }
                }
            }
        }
        stage('Deploy with docker-compose') {
            steps {
                script {
                    bat "docker-compose up"
                }
            }
        }
    }
    
}
