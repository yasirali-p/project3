pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'yasir1510/nodeimage'
        DOCKER_TAG = 'latest'
        NPM_CONFIG_CACHE = './.npm-cache'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/yasirali-p/project3.git'
            }
        }

        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:18'
                    args '-v $HOME/.npm:/root/.npm'
                }
            }
            steps {
                sh 'mkdir -p .npm-cache'
                sh 'npm install'
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'node:18'
                }
            }
            steps {
                sh 'npm test'
            }
        }

        stage('Build and Push Docker Image') {
            agent {
                docker {
                    image 'docker:20.10.16-dind' // Docker-in-Docker
                    args '--privileged -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'ca43f1a1-4472-4147-aeda-cca85209efce',
                    usernameVariable: 'yasir1510',
                    passwordVariable: 'yasir@1510'
                )]) {
                    sh '''
                        echo "yasir@1510" | docker login -u "yasir1510" --password-stdin
                        docker build -t yasir1510/node-app:latest .
                        docker push yasir1510/node-app:latest
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            environment {
                KUBECONFIG = '/home/jenkins/.kube/config'
            }
            steps {
                sh 'kubectl apply -f k8s/deployment.yml'
                sh 'kubectl apply -f k8s/service.yml'
                sh 'kubectl rollout status deployment/node-app'
                sh 'kubectl apply -f k8s/canary-deployment.yml'
                sh 'kubectl rollout status deployment/node-app-canary'
            }
        }

        stage('Monitor Deployment') {
            steps {
                sh 'kubectl apply -f monitoring.yml'
                sh 'kubectl get pods'
            }
        }
    }

    post {
        failure {
            echo '❌ CI/CD Pipeline failed.'
        }
    }
}
