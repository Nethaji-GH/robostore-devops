pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Install') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Backend Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh 'docker build -t robostore-backend:latest ./backend'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build -t robostore-frontend:latest ./frontend'
            }
        }

    }

    post {

        success {
            echo 'RoboStore CI pipeline completed successfully!'
        }

        failure {
            echo 'RoboStore CI pipeline failed.'
        }

    }
}