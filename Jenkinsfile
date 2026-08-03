pipeline {


agent any

environment {
    AWS_REGION = 'us-east-1'
    ECR_REGISTRY = '281639841832.dkr.ecr.us-east-1.amazonaws.com'
}

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

    stage('Login to Amazon ECR') {
        steps {
            withCredentials([
                usernamePassword(
                    credentialsId: 'robostore-aws',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )
            ]) {
                sh '''
                    export AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"

                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS --password-stdin $ECR_REGISTRY
                '''
            }
        }
    }

    stage('Tag Docker Images') {
        steps {
            sh '''
                docker tag robostore-backend:latest \
                $ECR_REGISTRY/robostore-backend:latest

                docker tag robostore-frontend:latest \
                $ECR_REGISTRY/robostore-frontend:latest
            '''
        }
    }

    stage('Push Images to ECR') {
        steps {
            sh '''
                docker push $ECR_REGISTRY/robostore-backend:latest
                docker push $ECR_REGISTRY/robostore-frontend:latest
            '''
        }
    }

    stage('Deploy to EC2') {
        steps {
            sh '''
                ssh -o StrictHostKeyChecking=no \
                -i /var/jenkins_home/.ssh/robostore-key.pem \
                ubuntu@54.83.127.72 \
                "cd ~/robostore-deployment && \
                docker compose pull && \
                docker compose up -d && \
                docker compose ps"
            '''
        }
    }
}

post {

    success {
        echo 'RoboStore CI/CD pipeline completed successfully!'
    }

    failure {
        echo 'RoboStore CI/CD pipeline failed.'
    }
}


}
