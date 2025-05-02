pipeline {
  agent any

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
        }
      }
    }

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
