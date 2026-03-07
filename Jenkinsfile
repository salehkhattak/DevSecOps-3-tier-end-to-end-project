pipeline {

    agent any

    environment {
        DOCKER_USER    = 'salehktk005'
        FRONTEND_IMAGE = "${DOCKER_USER}/nodes-app-frontend"
        BACKEND_IMAGE  = "${DOCKER_USER}/nodes-app-backend"
        IMAGE_TAG      = "${BUILD_NUMBER}"
        SCANNER_HOME   = tool 'SonarScanner'
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
                agent {
                docker {
                image 'node:18'
                   }
               }
            steps {
                dir('backend') {
                    sh 'npm install'
                }
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

       stage('SonarQube Analysis') {
         steps {
            withSonarQubeEnv('SonarQube') {
            sh """
            ${SCANNER_HOME}/bin/sonar-scanner \
            -Dsonar.projectKey=devsecops_project \
            -Dsonar.projectName=devsecops_project \
            -Dsonar.sources=. \
            -Dsonar.host.url=http://host.docker.internal:9000 \
            """
        }
    }
}

        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --format XML', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ./backend
                docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ./frontend

                docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest
                docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest
                """
            }
        }

        // stage('Trivy Security Scan') {
        //     steps {
        //         sh """
        //         trivy image --exit-code 1 --severity HIGH,CRITICAL ${BACKEND_IMAGE}:${IMAGE_TAG}
        //         trivy image --exit-code 1 --severity HIGH,CRITICAL ${FRONTEND_IMAGE}:${IMAGE_TAG}
        //         """
        //     }
        // }

          stage('Trivy Scan') {
            steps {
                sh """
                docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                aquasec/trivy image \
                --severity HIGH,CRITICAL \
                ${BACKEND_IMAGE}:${IMAGE_TAG}

                docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                aquasec/trivy image \
                --severity HIGH,CRITICAL \
                ${FRONTEND_IMAGE}:${IMAGE_TAG}
                """
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {

                    sh """
                    echo \$PASS | docker login -u \$USER --password-stdin

                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}

                    docker push ${BACKEND_IMAGE}:latest
                    docker push ${FRONTEND_IMAGE}:latest
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {

                withCredentials([file(credentialsId: 'k8s-config', variable: 'KUBECONFIG')]) {

                    sh """
                    echo "🚀 Deploying Notes App..."

                    kubectl --kubeconfig=\$KUBECONFIG apply -f k8s/namespace.yml
                    kubectl --kubeconfig=\$KUBECONFIG apply -f k8s/pv.yml

                    kubectl --kubeconfig=\$KUBECONFIG apply -f k8s/mysql-k8s/
                    kubectl --kubeconfig=\$KUBECONFIG wait --for=condition=ready pod -l app=mysql -n notes-app --timeout=120s

                    kubectl --kubeconfig=\$KUBECONFIG apply -f k8s/backend-k8s/
                    kubectl --kubeconfig=\$KUBECONFIG apply -f k8s/frontend-k8s/

                    kubectl --kubeconfig=\$KUBECONFIG apply -f k8s/ingress.yml

                    kubectl --kubeconfig=\$KUBECONFIG get all -n notes-app
                    """
                }
            }
        }
    }

    post {

        always {
            sh 'docker logout || true'
            cleanWs()
        }

        success {
            echo '✅ Deployment Successful'
        }

        failure {
            echo '❌ Deployment Failed'
        }
    }
}
