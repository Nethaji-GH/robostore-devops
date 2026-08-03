pipeline {

```
agent any

environment {
    AWS_REGION = 'us-east-1'
    ECR_REGISTRY = '281639841832.dkr.ecr.us-east-1.amazonaws.com'
    AWS_CREDENTIALS = credentials('robostore-aws')
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
            sh '''
                export AWS_ACCESS_KEY_ID="$AWS_CREDENTIALS_USR"
                export AWS_SECRET_ACCESS_KEY="$AWS_CREDENTIALS_PSW"

                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin $ECR_REGISTRY
            '''
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
}

post {

    success {
        echo 'RoboStore CI/CD pipeline completed successfully!'
    }

    failure {
        echo 'RoboStore CI/CD pipeline failed.'
    }

}
```

}
