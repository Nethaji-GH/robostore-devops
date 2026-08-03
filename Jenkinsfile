pipeline {


agent any

environment {
    AWS_REGION = 'us-east-1'
    AWS_ACCOUNT_ID = '281639841832'
    ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    EC2_HOST = '54.83.127.72'
    EC2_USER = 'ubuntu'
    SSH_KEY = '/var/jenkins_home/.ssh/robostore-key.pem'
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
                    credentialsId: 'aws-credentials',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )
            ]) {
                sh '''
                    aws ecr get-login-password --region $AWS_REGION |
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
            withCredentials([
                usernamePassword(
                    credentialsId: 'aws-credentials',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )
            ]) {
                sh '''
                    ssh -o StrictHostKeyChecking=no \
                        -i $SSH_KEY \
                        $EC2_USER@$EC2_HOST "
                            cd /home/ubuntu/robostore-deployment &&
                            aws ecr get-login-password --region $AWS_REGION |
                            docker login --username AWS --password-stdin $ECR_REGISTRY &&
                            docker compose pull &&
                            docker compose up -d &&
                            docker image prune -f
                        "
                '''
            }
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
