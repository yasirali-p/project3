pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }

    environment {
        DOCKER_IMAGE = 'yasir1510/nodeimage'
        DOCKER_TAG = 'latest'
        DOCKER_REGISTRY_URL = 'https://index.docker.io/v1/'
        NPM_CONFIG_CACHE = './.npm-cache'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/yasirali-p/project3.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'mkdir -p .npm-cache'
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'ca43f1a1-4472-4147-aeda-cca85209efce',
                        usernameVariable: 'yasir1510',
                        passwordVariable: 'yasir@150'
                    )]) {
                        sh """
                            echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                            docker build -t $DOCKER_IMAGE:$DOCKER_TAG .
                            docker push $DOCKER_IMAGE:$DOCKER_TAG
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/deployment.yml'
                sh 'kubectl apply -f k8s/service.yml'
                sh 'kubectl rollout status deployment/node-app'
                sh 'kubectl apply -f k8s/canary-deployment.yml'
                sh 'kubectl rollout status deployment/node-app-canary'
            }
        }

        stage('Monitor Deployment') {
            steps {
                sh 'kubectl apply -f monitoring.yml'
                sh 'kubectl get pods -n monitoring'
            }
        }
    }
}
