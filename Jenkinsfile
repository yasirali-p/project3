pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = 'ca43f1a1-4472-4147-aeda-cca85209efce' // Jenkins credentials ID
        DOCKER_IMAGE = 'yasir1510/nodeimage'
        GIT_BRANCH = 'main'
    }

    stages {
        stage('Clone Repository') 
            steps {
                git branch: "main", url: 'https://github.com/yasirali-p/project3.git', credentialsId: '068f6da2-eafc-4c90-a4f6-1f3ba3d27b38'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        // ✅ NEW: Build stage (for future extensibility)
        stage('index.js Build') {
            steps {
                echo 'No build step required for index.js - using plain Node.js'
                // If using TypeScript or Babel, compile here
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t yasir1510/nodeimage:latest ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'ca43f1a1-4472-4147-aeda-cca85209efce', passwordVariable: 'yasir@1510', usernameVariable: 'yasir1510')]) {
                    sh '''
                        echo yasir@1510 | docker login -u yasir1510 --password-stdin
                        docker push yasir1510/nodeimage:latest
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh 'export KUBECONFIG=/var/lib/jenkins/.kube/config && kubectl apply -f deployment.yaml'
                    sh 'export KUBECONFIG=/var/lib/jenkins/.kube/config && kubectl apply -f service.yaml'
                }
            }
        }

        stage('Canary Deployment') {
            steps {
                script {
                    sh 'export KUBECONFIG=/var/lib/jenkins/.kube/config && kubectl apply -f canary.yaml'
                }
            }
        }

        stage('Rolling Update') {
            steps {
                script {
                    sh 'export KUBECONFIG=/var/lib/jenkins/.kube/config && kubectl apply -f rolling.yaml'
                }
            }
        }
    }
}
