pipeline {
  agent any

  environment {
    DOCKER_CREDENTIALS_ID = 'ca43f1a1-4472-4147-aeda-cca85209efce'
    IMAGE_NAME = 'yasir1510/node-app'
    KUBECONFIG = '/var/lib/jenkins/.kube/config' // ✅ Fix added here
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/yasirali-p/project3.git'
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
        withCredentials([
          usernamePassword(
            credentialsId: "${DOCKER_CREDENTIALS_ID}",
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
          )
        ]) {
          script {
            docker.withRegistry('', "${DOCKER_CREDENTIALS_ID}") {
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
        sh 'kubectl rollout status deployment/node-app'
        sh 'kubectl apply -f k8s/canary-deployment.yml'
      }
    }
  }
}
