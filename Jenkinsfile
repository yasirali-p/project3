pipeline {
    agent any

    environment {
        IMAGE_NAME = 'yasir1510/nodeimage:latest'
        DOCKER_HUB_CREDENTIALS = 'ca43f1a1-4472-4147-aeda-cca85209efce'  // Add this in Jenkins Credentials
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/yasirali-p/project3.git' // <-- Replace with your Git repo
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
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${ca43f1a1-4472-4147-aeda-cca85209efce}", usernameVariable: 'yasir1510', passwordVariable: 'yasir@1510')]) {
                    sh '''
                        echo "yasir@1510" | docker login -u "yasir1510" --password-stdin
                        docker push ${IMAGE_NAME}
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
            echo '❌ Something went wrong during the pipeline.'
        }
    }
}

