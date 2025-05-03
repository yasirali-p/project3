pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "yasir1510/nodeimage:latest"
        DOCKER_HUB_CREDENTIALS = 'ca43f1a1-4472-4147-aeda-cca85209efce'   // Jenkins credential ID for DockerHub (username+token)
        GITHUB_CREDENTIALS = '068f6da2-eafc-4c90-a4f6-1f3ba3d27b38'           // Jenkins credential ID for GitHub (no password)
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: "${GITHUB_CREDENTIALS}", url: 'git@github.com:yasirali-p/project3.git'
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
                sh "docker build -t yasir1510/nodeimage:latest ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "ca43f1a1-4472-4147-aeda-cca85209efce", usernameVariable: 'yasir1510', passwordVariable: 'yasir@1510')]) {
                    sh '''
                        echo "$DOCKER_TOKEN" | docker login -u "$yasir1510" --password-stdin
                        docker push yasir1510/nodeimage:latest
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f k8s/deployment.yml
                    kubectl apply -f k8s/service.yml
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment successful.'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}
