#!/bin/bash

echo "🚀 Deploying Notes App to Kubernetes..."

# Apply namespace first
kubectl apply -f k8s/namespace.yml
# Apply PV
kubectl apply -f k8s/pv.yml

# Deploy MySQL
echo "📦 Deploying MySQL..."
kubectl apply -f k8s/mysql-k8s/

# Wait for MySQL
echo "⏳ Waiting for MySQL to be ready..."
kubectl wait --for=condition=ready pod -l app=mysql -n notes-app --timeout=120s

# Deploy Backend
echo "🔧 Deploying Backend..."
kubectl apply -f k8s/backend-k8s/

# Deploy Frontend
echo "🎨 Deploying Frontend..."
kubectl apply -f k8s/frontend-k8s/

# Apply Ingress
echo "🌐 Applying Ingress..."
kubectl apply -f k8s/ingress.yml

# Show status
echo "✅ Deployment complete! Status:"
kubectl get all -n notes-app
kubectl get pv -n notes-app
kubectl get ingress -n notes-app


# To access the app, use the following URL:
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
kubectl port-forward -n notes-app svc/backend-service 5000:5000
kubectl port-forward -n notes-app svc/frontend-service 5173:5173