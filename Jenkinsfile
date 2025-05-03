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
=======
  environment {
    IMAGE_NAME = "yasir1510/nodeimage"
    REGISTRY_URL = "https://yasir1510/nodeimage"
    DOCKER_CREDS = credentials('ca43f1a1-4472-4147-aeda-cca85209efce') // Docker Hub token/credentials
  }

  stages {
    stage('Checkout from GitHub') {
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
        script {
          dockerImage = docker.build("${IMAGE_NAME}:latest")
        }
      }
    }

    stage('Push Docker Image') {
      steps {
        script {
          docker.withRegistry(REGISTRY_URL, 'dockerhub-token') {
            dockerImage.push("latest")
          }
>>>>>>> origin/main
        }
    }

<<<<<<< HEAD
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
=======
    stage('Deploy to Kubernetes') {
      steps {
        sh 'kubectl apply -f k8s/deployment.yml'
        sh 'kubectl apply -f k8s/service.yml'
      }
    }

    stage('Start Monitoring Stack') {
      steps {
        sh 'docker-compose -f monitoring.yml up -d'
      }
    }
  }

  post {
    success {
      echo '✅ CI/CD pipeline completed successfully!'
    }
    failure {
      echo '❌ CI/CD pipeline failed.'
    }
  }
>>>>>>> origin/main
