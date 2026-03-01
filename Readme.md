# Deploy everything
chmod +x deploy.sh
./deploy.sh

# Or deploy manually
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/pv.yaml
kubectl apply -f k8s/mysql-k8s/
kubectl apply -f k8s/backend-k8s/
kubectl apply -f k8s/frontend-k8s/
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/ingress.yaml

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