pipeline {
    agent any

    environment {
        DOCKER_REGISTRY_CREDENTIALS = credentials('ca43f1a1-4472-4147-aeda-cca85209efce')
        DOCKER_IMAGE = 'yasir1510/nodeimage'
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                git branch: 'main',
                url: 'https://github.com/yasirali-p/project3.git'
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
                    // Apply main deployment
                    sh 'kubectl apply -f k8s/deployment.yml'
                    
                    // Apply service
                    sh 'kubectl apply -f k8s/service.yml'
                    
                    // Wait for stable deployment to be ready
                    sh 'kubectl rollout status deployment/node-app'
                    
                    // Deploy canary
                    sh 'kubectl apply -f k8s/canary-deployment.yml'
                    
                    // Verify canary deployment
                    sh 'kubectl rollout status deployment/node-app-canary'
                }
            }
        }

        stage('Monitor Deployment') {
            steps {
                script {
                    // Apply monitoring stack
                    sh 'kubectl apply -f monitoring.yml'
                    
                    // Verify monitoring components
                    sh 'kubectl get pods -n monitoring'
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace
            deleteDir()
        }
        success {
            slackSend(color: '#00FF00', message: 'SUCCESS: Pipeline completed successfully')
        }
        failure {
            slackSend(color: '#FF0000', message: 'FAILED: Pipeline failed')
        }
    }
}
