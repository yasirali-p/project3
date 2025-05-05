pipeline {
    agent {
        docker {
            image 'node:18' // Uses official Node.js Docker image
            args '-u root'  // Optional: runs container as root user
        }
    }

    environment {
        IMAGE_NAME = 'yasir1510/nodeimage:latest'
        DOCKER_HUB_CREDENTIALS = 'ca43f1a1-4472-4147-aeda-cca85209efce'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/yasirali-p/project3.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${IMAGE_NAME}
                    '''
                }
            }
        }

        stage('Deploy to Local Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f k8s/deployment.yml
                    kubectl apply -f k8s/canary-deployment.yml
                    kubectl apply -f k8s/service.yml
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl get pods -l app=node-app'
                sh 'kubectl get svc node-app-service'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully.'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
    }
}
