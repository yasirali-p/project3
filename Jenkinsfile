pipeline {
    agent {
        docker {
            image 'docker:19' // Use Docker image that has Docker CLI installed
            args '-v /var/run/docker.sock:/var/run/docker.sock' // Mount Docker socket for Docker-in-Docker
        }
    }

    environment {
        IMAGE_NAME = 'yasir1510/nodeimage:latest'
        DOCKER_HUB_CREDENTIALS = 'ca43f1a1-4472-4147-aeda-cca85209efce'
    }

    stages {
        stage('Clone Repository') {
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
                sh "docker build -t yasir1510/node-app:latest ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "ca43f1a1-4472-4147-aeda-cca85209efce'", usernameVariable: 'yasir1510', passwordVariable: 'yasir@1510')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "yasir1510" --password-stdin
                        docker push yasir1510/node-app:latest
                    '''
                }
            }
        }

        stage('Deploy to Local Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f k8s/deployment.yml
                    kubectl apply -f k8s/canary-deployment.yml
                    kubectl apply -f k8s/service.yml
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl get pods -l app=node-app'
                sh 'kubectl get svc node-app-service'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully.'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
    }
}
