# Deploy everything
chmod +x deploy.sh
./deploy.sh

# Or deploy manually
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/pv.yml
kubectl apply -f k8s/mysql-k8s/
kubectl apply -f k8s/backend-k8s/
kubectl apply -f k8s/frontend-k8s/
kubectl apply -f k8s/hpa.yml
kubectl apply -f k8s/ingress.yml

# Check everything
kubectl get all,pv,pvc,hpa,ingress -n notes-app

# If using minikube, enable ingress
minikube addons enable ingress

# Add to hosts file (for local testing)
echo "$(minikube ip) notes-app.local" | sudo tee -a /etc/hosts

# Access the app
open http://notes-app.local

suggested plugin to install
1,Security

OWASP Dependency-Check
SonarQube Scanner
Warnings NG
2,Containers
Docker Pipeline
Credentials Binding

3,Core
Pipeline
Git
Blue Ocean
HTML Publisher


# create a docker network
docker network create notes-app

# jenkins run command
docker run -d `
  --name jenkins `
  --network notes-app `
  -p 8080:8080 `
  -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  -v /var/run/docker.sock:/var/run/docker.sock `
  jenkins/jenkins:lts

  # sonar qube run command
  docker run -d --name sonarqube `
  --network notes-app `
  -p 9000:9000 `
  sonarqube:lts



  # diagram

                  GitHub
                   │
                   ▼
                Jenkins
                   │
      ┌────────────┼─────────────┐
      ▼            ▼             ▼
  SonarQube     Trivy          dockerhub
(Code Scan)  (Security Scan) (Artifacts)
      │
      ▼
 Docker Image
      │
      ▼
 Kubernetes Deployment
      │
      ▼
 Prometheus → Grafana Monitoring

 # pipeline
 GitHub
  │
  ▼
Jenkins
  │
  ├── Build Docker Image
  ├── SonarQube Code Analysis
  ├── Trivy Security Scan
  ├── Push Image → DockerHub
  └── Deploy → Kubernetes
        │
        ▼
   Prometheus + Grafana Monitoring