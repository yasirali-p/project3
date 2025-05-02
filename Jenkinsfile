pipeline {
  agent any

  environment {
    DOCKER_CREDENTIALS_ID = 'ca43f1a1-4472-4147-aeda-cca85209efce'  // DockerHub token credentials ID
    GITHUB_CREDENTIALS_ID = '068f6da2-eafc-4c90-a4f6-1f3ba3d27b38'  // GitHub token credentials ID
    IMAGE_NAME = 'yasir1510/nodeimage'
  }

  stages {
    stage('Checkout') {
      steps {
        withCredentials([string(credentialsId: "${GITHUB_CREDENTIALS_ID}", variable: 'GITHUB_TOKEN')]) {
          git url: 'https://github.com/yasirali-p/project3.git', credentialsId: "${GITHUB_CREDENTIALS_ID}", branch: 'main'
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          docker.build("${IMAGE_NAME}:latest", './node-app')
        }
      }
    }

    stage('Push to DockerHub') {
      steps {
        withCredentials([string(credentialsId: "${DOCKER_CREDENTIALS_ID}", variable: 'DOCKER_TOKEN')]) {  // Fetch DockerHub token
          script {
            docker.withRegistry('', "${DOCKER_TOKEN}") {  // Use the token for DockerHub registry
              docker.image("${IMAGE_NAME}:latest").push()
            }
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh 'kubectl apply -f k8s/deployment.yaml'
        sh 'kubectl apply -f k8s/service.yaml'
      }
    }
  }
}

