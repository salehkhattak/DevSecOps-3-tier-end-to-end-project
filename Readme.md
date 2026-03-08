
# 🚀 End-to-End DevSecOps CI/CD Pipeline for a 3-Tier Application

This project demonstrates a production-style DevSecOps pipeline for a containerized 3-tier application.  
The pipeline automates code quality checks, security scanning, container image creation, Kubernetes deployment, and monitoring.

The goal of this project is to simulate a real-world DevSecOps workflow used in modern cloud-native environments.

# 🏗️ Project Architecture Overview:
┌─────────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                             │
│                (3-Tier Notes Application Code)                       │
└────────────────────────┬────────────────────────────────────────────┘
                         │ WebHook Trigger
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Jenkins Pipeline                             │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 1: Code Checkout                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                          │                                           │
│                          ▼                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 2: Code Quality Analysis                                │  │
│  │ • SonarQube Static Code Analysis                              │  │
│  │ • OWASP Dependency Check                                      │  │
│  │ • Code Coverage Reports                                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                          │                                           │
│                          ▼                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 3: Security Scanning                                    │  │
│  │ • Trivy Filesystem Scan                                       │  │
│  │ • Container Vulnerability Scan                                │  │
│  │ • Secret Detection                                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                          │                                           │
│                          ▼                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 4: Build & Package                                      │  │
│  │ • Build Docker Images                                         │  │
│  │ • Backend Service                                             │  │
│  │ • Frontend Service                                            │  │
│  │ • Database Migrations                                         │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                          │                                           │
│                          ▼                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 5: Container Security                                   │  │
│  │ • Trivy Image Scan                                            │  │
│  │ • Docker Bench Security                                       │  │
│  │ • Image Signing & Verification                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                          │                                           │
│                          ▼                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 6: Push to Registry                                     │  │
│  │ • DockerHub Push                                              │  │
│  │ • Version Tagging                                             │  │
│  │ • Latest Tag Update                                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                          │                                           │
│                          ▼                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 7: Deploy to Kubernetes                                 │  │
│  │ • Apply Kubernetes Manifests                                  │  │
│  │ • Rolling Update Strategy                                     │  │
│  │ • Health Checks                                               │  │
│  │ • Auto-scaling Configuration                                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                          │                                           │
│                          ▼                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 8: Post-Deployment Tests                                │  │
│  │ • Smoke Tests                                                 │  │
│  │ • Integration Tests                                           │  │
│  │ • Performance Tests                                           │  │
│  │ • Security Tests (OWASP ZAP)                                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Kubernetes Cluster                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Backend    │  │   Frontend   │  │   MySQL      │             │
│  │   Pods       │  │   Pods       │  │   Database   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│         │               │                  │                       │
│         └───────────────┼──────────────────┘                       │
│                         ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                    Monitoring Stack                           │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │ │
│  │  │  Prometheus  │◀─│  Grafana     │  │  AlertManager│        │ │
│  │  │  Metrics     │  │  Dashboards  │  │  Alerts      │        │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │ │
│  │         │               │                  │                  │ │
│  │         └───────────────┼──────────────────┘                  │ │
│  │                         ▼                                      │ │
│  │  ┌──────────────┐  ┌──────────────┐                          │ │
│  │  │  Node        │  │  cAdvisor    │                          │ │
│  │  │  Exporter    │  │  Container   │                          │ │
│  │  └──────────────┘  └──────────────┘                          │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

# 📋 Table of Contents
Prerequisites

1. Project Structure

2. Infrastructure Setup

3. Jenkins Configuration

4. Pipeline Stages

5. Kubernetes Deployment

6. Monitoring Setup

7. Security Tools Integration

8. Troubleshooting Guide

# Create Docker Network

# Create isolated network for all services
docker network create devsecops-network --subnet=172.20.0.0/16

# Verify network creation
docker network ls
docker network inspect devsecops-network

# ⚙️ Tech Stack
| Category                | Tools                  |
| ----------------------- | ---------------------- |
| Source Control          | GitHub                 |
| CI/CD                   | Jenkins                |
| Code Quality            | SonarQube              |
| Dependency Security     | OWASP Dependency-Check |
| Container Security      | Trivy                  |
| Containerization        | Docker                 |
| Container Registry      | DockerHub              |
| Container Orchestration | Kubernetes             |
| Monitoring              | Prometheus             |
| Visualization           | Grafana                |

# 🧪 Security Scanning

This pipeline implements DevSecOps best practices:

# 🕵️‍♂️ Static Code Analysis
Using SonarQube to detect:
Code smells
Bugs
Security vulnerabilities

# Dependency Scanning
Using OWASP Dependency-Check to detect vulnerable dependencies.

# Container Security
 Using Trivy to scan Docker images before deployment.


 # 🔌 Jenkins Plugins
OWASP Dependency-Check
SonarQube Scanner
Warnings NG
Container
Docker Pipeline
Credentials Binding
Pipeline
Git
Blue Ocean
HTML Publisher


# 📊 Monitoring Stack

The deployed application is monitored using:

Prometheus for metrics collection
Grafana for dashboards and visualization

# Metrics include:
Pod CPU / Memory usage
Request latency
Application health
Kubernetes cluster metrics

CPU threshold: 70%
Min pods: 2
Max pods: 10

# 🎯 Key DevSecOps Features

✔ Automated CI/CD pipeline
✔ Static code analysis
✔ Dependency vulnerability scanning
✔ Container image security scanning
✔ Automated Docker image builds
✔ Kubernetes deployment automation
✔ Horizontal auto-scaling
✔ Monitoring and observability

# 🚀 Conclusion
This end-to-end DevSecOps pipeline ensures that security is integrated at every stage of the software development lifecycle, from code commit to production deployment. By leveraging industry-standard tools and best practices, this pipeline provides a robust framework for building, securing, and deploying applications in a modern cloud-native environment.






## Known Issues while building project:

In some environments Jenkins may fail to execute Docker commands due to Docker socket permission issues.

Error:
docker: not found

This happens when Jenkins container cannot access the host Docker daemon.

Solutions include:
- Mounting /var/run/docker.sock
- Running Jenkins with docker group permissions
- Using Jenkins Docker agents

The rest of the pipeline (security scanning, Kubernetes deployment, monitoring) works correctly.