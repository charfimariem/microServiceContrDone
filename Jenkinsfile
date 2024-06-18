pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('DockerHub')
    }
    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }
        stage('Install Node.js and Dependencies') {
            steps {
                script {
                    def nodejsHome = tool name: 'NodeJS', type: 'NodeJSInstallation'
                    env.PATH = "${nodejsHome}/bin:${env.PATH}"
                }
                bat 'npm install'
            }
        }
        stage('Build & Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'DockerHub') {
                        def app = docker.build("your_dockerhub_username/appbackend:latest")
                        app.push()
                    }
                }
            }
        }
        stage('Deploy with docker-compose') {
            steps {
                script {
                    bat 'docker-compose down' // Ensure previous instances are stopped
                    bat 'docker-compose up -d'
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
