pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }

    environment {
        DOCKER_REGISTRY_CREDENTIALS = credentials('ca43f1a1-4472-4147-aeda-cca85209efce')
        DOCKER_IMAGE = 'yasir1510/nodeimage'
        DOCKER_TAG = 'latest'
        NPM_CONFIG_CACHE = './.npm-cache'
    }

    stages {
        stage('Checkout from GitHub') {
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

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-token') {
                        def customImage = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                        customImage.push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh 'kubectl apply -f k8s/deployment.yml'
                    sh 'kubectl apply -f k8s/service.yml'
                    sh 'kubectl rollout status deployment/node-app'
                    sh 'kubectl apply -f k8s/canary-deployment.yml'
                    sh 'kubectl rollout status deployment/node-app-canary'
                }
            }
        }

        stage('Monitor Deployment') {
            steps {
                script {
                    sh 'kubectl apply -f monitoring.yml'
                    sh 'kubectl get pods -n monitoring'
                }
            }
        }
    }
}
