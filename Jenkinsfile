pipeline {
    agent {
        docker {
            image 'yasir1510/nodeimage:latest'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        DOCKER_IMAGE = 'yasir1510/nodeimage'
        DOCKER_TAG = 'latest'
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
                        passwordVariable: 'yasir@1510'
                    )]) {
                        sh """
                            echo "Logging into Docker Hub..."
                            docker login -u yasir1510 -p yasir@1510

                            echo "Building Docker image..."
                            docker build -t yasir1510/node-app:latest .

                            echo "Pushing Docker image..."
                            docker push yasir1510/node-app:latest
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
                sh 'kubectl get pods'
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline completed successfully.'
        }
        failure {
            echo '❌ CI/CD Pipeline failed.'
        }
    }
}
