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
          docker.build("yasir1510/node-app:latest", './node-app')
        }
      }
    }

    stage('Push to DockerHub') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: "ca43f1a1-4472-4147-aeda-cca85209efce",
            usernameVariable: 'yasir1510',
            passwordVariable: 'yasir@1510'
          )
        ]) {
          script {
            docker.withRegistry('', "${DOCKER_CREDENTIALS_ID}") {
              docker.image("yasir1510/node-app:latest").push()
            }
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh 'kubectl apply -f k8s/deployment.yaml'
        sh 'kubectl apply -f k8s/canary-deployment.yml'
        sh 'kubectl apply -f k8s/service.yaml'
        sh 'kubectl rollout status deployment/node-app'
      }
    }
  }
}
