# 🛒 E-Commerce Application — Kubernetes Deployment & Audit

A full-stack e-commerce application deployed and audited on Kubernetes using a **3-node KIND cluster**.

This project demonstrates how a containerized **React + Node.js/Express + PostgreSQL** application can be migrated from Docker Compose to Kubernetes while implementing production-oriented Kubernetes concepts such as Deployments, Services, ConfigMaps, Secrets, Persistent Storage, Probes, Ingress, HPA, RBAC, CronJobs, Rolling Updates and Rollbacks.

---

## 🚀 Project Overview

This project started as a Dockerized three-tier e-commerce application and has been extended with a complete Kubernetes deployment.

### Application Stack

* 🎨 **Frontend:** React + Nginx
* ⚙️ **Backend:** Node.js + Express
* 🗄️ **Database:** PostgreSQL 16
* 🐳 **Containerization:** Docker
* ☸️ **Orchestration:** Kubernetes
* 🧪 **Local Kubernetes Cluster:** KIND
* 🌐 **Ingress:** NGINX Ingress Controller
* 📈 **Autoscaling:** Horizontal Pod Autoscaler
* 🔐 **Security:** Kubernetes Secrets + RBAC
* 💾 **Persistent Storage:** PersistentVolumeClaim
* 🔄 **CI/CD:** GitHub Actions

---

# 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       Browser        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   NGINX Ingress      │
                         │     Controller       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Frontend Service     │
                         │      ClusterIP       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │    React + Nginx Frontend    │
                    │         2 Replicas            │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                         ┌──────────────────────┐
                         │  Backend Service     │
                         │      ClusterIP       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │ Node.js + Express Backend    │
                    │         2+ Replicas           │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                         ┌──────────────────────┐
                         │ PostgreSQL Service   │
                         │      ClusterIP       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │       PostgreSQL 16          │
                    │        Persistent Data       │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                         ┌──────────────────────┐
                         │ PostgreSQL PVC       │
                         │      2Gi Storage      │
                         └──────────────────────┘
```

---

# ☸️ Kubernetes Architecture

The application runs inside the `ecommerce` namespace.

```text
KIND Cluster
│
├── Control Plane
│
├── Worker Node
│
└── Worker Node
     │
     └── ecommerce namespace
          │
          ├── Frontend Deployment
          │    ├── Frontend Pod
          │    └── Frontend Pod
          │
          ├── Backend Deployment
          │    ├── Backend Pod
          │    └── Backend Pod
          │
          ├── PostgreSQL Deployment
          │    └── PostgreSQL Pod
          │
          ├── Frontend Service
          ├── Backend Service
          ├── PostgreSQL Service
          │
          ├── ConfigMap
          ├── Secret
          ├── PersistentVolumeClaim
          ├── Ingress
          ├── HPA
          ├── ServiceAccount
          ├── Role
          ├── RoleBinding
          └── CronJob
```

---

# 📂 Project Structure

```text
ecommerce-app/
│
├── client/
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── Dockerfile
│   └── index.js
│
├── k8s/
│   │
│   ├── namespace/
│   │   └── namespace.yaml
│   │
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   │
│   ├── backend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── configmap.yaml
│   │
│   ├── database/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── secret.yaml
│   │   └── pvc.yaml
│   │
│   ├── ingress/
│   │   └── ingress.yaml
│   │
│   ├── hpa/
│   │   └── backend-hpa.yaml
│   │
│   ├── rbac/
│   │   ├── serviceaccount.yaml
│   │   ├── role.yaml
│   │   └── rolebinding.yaml
│   │
│   └── cronjob/
│       └── cronjob.yaml
│
├── kind/
│   └── kind-config.yaml
│
├── .github/
│   └── workflows/
│       └── k8s-audit.yml
│
├── audit.sh
├── K8S-AUDIT.md
├── docker-compose.yml
└── README.md
```

---

# 🐳 Docker Architecture

Before Kubernetes, the application was running using Docker Compose.

```text
Docker Compose

React Frontend
      │
      ▼
Node.js / Express Backend
      │
      ▼
PostgreSQL Database
```

The Kubernetes implementation replaces Docker Compose service discovery with Kubernetes Services.

For example:

```text
Docker Compose:

db:5432
```

becomes:

```text
Kubernetes:

postgres:5432
```

The backend communicates with PostgreSQL using the Kubernetes Service DNS name.

---

# ☸️ Kubernetes Concepts Implemented

This project demonstrates the following Kubernetes concepts.

| #  | Kubernetes Concept          | Status |
| -- | --------------------------- | ------ |
| 1  | Deployment + ReplicaSet     | ✅      |
| 2  | Services                    | ✅      |
| 3  | Namespace                   | ✅      |
| 4  | Labels & Selectors          | ✅      |
| 5  | Rolling Update & Rollback   | ✅      |
| 6  | ConfigMap                   | ✅      |
| 7  | Secret                      | ✅      |
| 8  | Resource Requests & Limits  | ✅      |
| 9  | Liveness & Readiness Probes | ✅      |
| 10 | PersistentVolumeClaim       | ✅      |
| 11 | Ingress                     | ✅      |
| 12 | Multi-node KIND Cluster     | ✅      |
| 13 | Horizontal Pod Autoscaler   | ✅      |
| 14 | RBAC + ServiceAccount       | ✅      |
| 15 | CronJob                     | ✅      |
| 16 | GitHub Actions + KIND       | ✅      |

---

# 1️⃣ Namespace

All application resources are isolated inside:

```text
ecommerce
```

Create it with:

```bash
kubectl apply -f k8s/namespace/
```

Check:

```bash
kubectl get namespace
```

---

# 2️⃣ Deployments & ReplicaSets

The application uses separate Deployments for:

* Frontend
* Backend
* PostgreSQL

Check:

```bash
kubectl get deployments -n ecommerce
```

Check ReplicaSets:

```bash
kubectl get replicasets -n ecommerce
```

---

# 3️⃣ Services

Three internal Kubernetes Services are used:

```text
frontend
backend
postgres
```

Check:

```bash
kubectl get services -n ecommerce
```

All application services use `ClusterIP` because they only need internal cluster communication.

External access is handled by the Ingress Controller.

---

# 4️⃣ Labels & Selectors

Each application component uses Kubernetes labels.

Example:

```yaml
labels:
  app: ecommerce-backend
```

The corresponding Service selects the pods using:

```yaml
selector:
  app: ecommerce-backend
```

This provides reliable communication between Services and Pods.

---

# 5️⃣ Rolling Updates & Rollbacks

The frontend and backend Deployments use a rolling update strategy.

Example:

```yaml
strategy:
  type: RollingUpdate
```

A new application version can be deployed without immediately terminating all existing replicas.

Check rollout status:

```bash
kubectl rollout status deployment/ecommerce-backend \
  -n ecommerce
```

View rollout history:

```bash
kubectl rollout history deployment/ecommerce-backend \
  -n ecommerce
```

Rollback:

```bash
kubectl rollout undo deployment/ecommerce-backend \
  -n ecommerce
```

---

# 6️⃣ ConfigMap

Non-sensitive configuration is stored using a ConfigMap.

```text
k8s/backend/configmap.yaml
```

Example configuration:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
NODE_ENV
PORT
```

Check:

```bash
kubectl get configmap -n ecommerce
```

---

# 7️⃣ Secrets

Sensitive database credentials are stored using a Kubernetes Secret.

```text
k8s/database/secret.yaml
```

Check:

```bash
kubectl get secrets -n ecommerce
```

> ⚠️ Real production credentials should never be committed directly to GitHub. Use external secret management or a secure CI/CD secret store for production deployments.

---

# 8️⃣ Resource Requests & Limits

Application containers define CPU and memory requests and limits.

Example:

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"

  limits:
    cpu: "500m"
    memory: "512Mi"
```

This helps Kubernetes schedule workloads predictably and prevents containers from consuming unlimited resources.

---

# 9️⃣ Liveness & Readiness Probes

The application uses Kubernetes health checks.

### Readiness Probe

Determines whether a container is ready to receive traffic.

### Liveness Probe

Determines whether a container is healthy and should continue running.

Example:

```yaml
readinessProbe:
  httpGet:
    path: /
    port: 5000
```

Check probe configuration:

```bash
kubectl describe deployment ecommerce-backend \
  -n ecommerce
```

---

# 🔟 Persistent Storage

PostgreSQL uses a PersistentVolumeClaim.

```text
k8s/database/pvc.yaml
```

The PVC prevents database data from being tied to the lifecycle of a single PostgreSQL Pod.

Check:

```bash
kubectl get pvc -n ecommerce
```

Expected:

```text
postgres-pvc   Bound
```

---

# 1️⃣1️⃣ Ingress

NGINX Ingress Controller provides external HTTP access to the application.

Ingress configuration:

```text
k8s/ingress/ingress.yaml
```

Check:

```bash
kubectl get ingress -n ecommerce
```

Application host:

```text
ecommerce.localtest.me
```

Test:

```bash
curl http://ecommerce.localtest.me
```

Or:

```bash
curl -H "Host: ecommerce.localtest.me" \
  http://127.0.0.1
```

---

# 1️⃣2️⃣ Three-Node KIND Cluster

The application is deployed to a three-node KIND cluster:

```text
1 Control Plane
2 Worker Nodes
```

Check:

```bash
kubectl get nodes
```

Expected:

```text
kind-audit-control-plane
kind-audit-worker
kind-audit-worker2
```

---

# 1️⃣3️⃣ Horizontal Pod Autoscaler

The backend can scale based on CPU utilization.

Configuration:

```text
k8s/hpa/backend-hpa.yaml
```

Example:

```text
Minimum replicas: 2
Maximum replicas: 5
Target CPU: 60%
```

Check:

```bash
kubectl get hpa -n ecommerce
```

---

# 1️⃣4️⃣ RBAC & ServiceAccount

The backend uses a dedicated ServiceAccount.

RBAC resources:

```text
k8s/rbac/
```

Components:

```text
ServiceAccount
Role
RoleBinding
```

The Role provides only the required permissions instead of giving the workload unrestricted cluster access.

Check:

```bash
kubectl get role,rolebinding,serviceaccount \
  -n ecommerce
```

---

# 1️⃣5️⃣ CronJob

A Kubernetes CronJob periodically checks PostgreSQL availability.

Configuration:

```text
k8s/cronjob/cronjob.yaml
```

Check:

```bash
kubectl get cronjob -n ecommerce
```

Check Jobs:

```bash
kubectl get jobs -n ecommerce
```

---

# 1️⃣6️⃣ GitHub Actions

GitHub Actions is used to validate the Kubernetes deployment.

Workflow:

```text
.github/workflows/k8s-audit.yml
```

The workflow:

```text
GitHub Push
     │
     ▼
GitHub Actions
     │
     ▼
Create KIND Cluster
     │
     ▼
Build Docker Images
     │
     ▼
Load Images into KIND
     │
     ▼
Deploy Kubernetes Manifests
     │
     ▼
Wait for Rollouts
     │
     ▼
Verify Kubernetes Resources
```

---

# 🛠️ Prerequisites

Install the following:

* Docker
* kubectl
* KIND
* Git

Optional:

* Helm
* Metrics Server
* NGINX Ingress Controller

Verify:

```bash
docker --version
```

```bash
kubectl version --client
```

```bash
kind version
```

---

# 🚀 Setup & Deployment

## Step 1 — Clone Repository

```bash
git clone https://github.com/tejswini-maingade/ecommerce-app.git
```

```bash
cd ecommerce-app
```

---

## Step 2 — Create KIND Cluster

```bash
kind create cluster \
  --name kind-audit \
  --config kind/kind-config.yaml
```

Verify:

```bash
kubectl get nodes
```

---

## Step 3 — Build Docker Images

Frontend:

```bash
docker build \
  -t ecommerce-frontend:v1 \
  ./client
```

Backend:

```bash
docker build \
  -t ecommerce-backend:v1 \
  ./server
```

---

## Step 4 — Load Images into KIND

```bash
kind load docker-image \
  ecommerce-frontend:v1 \
  --name kind-audit
```

```bash
kind load docker-image \
  ecommerce-backend:v1 \
  --name kind-audit
```

---

## Step 5 — Deploy Namespace

```bash
kubectl apply \
  -f k8s/namespace/
```

---

## Step 6 — Deploy Database

```bash
kubectl apply \
  -f k8s/database/
```

Verify:

```bash
kubectl get pods -n ecommerce
```

---

## Step 7 — Deploy Backend

```bash
kubectl apply \
  -f k8s/backend/
```

Verify:

```bash
kubectl get pods -n ecommerce
```

---

## Step 8 — Deploy Frontend

```bash
kubectl apply \
  -f k8s/frontend/
```

---

## Step 9 — Deploy Ingress

```bash
kubectl apply \
  -f k8s/ingress/
```

---

## Step 10 — Deploy HPA

```bash
kubectl apply \
  -f k8s/hpa/
```

---

## Step 11 — Deploy RBAC

```bash
kubectl apply \
  -f k8s/rbac/
```

---

## Step 12 — Deploy CronJob

```bash
kubectl apply \
  -f k8s/cronjob/
```

---

# 🔍 Verify Deployment

Check all Kubernetes resources:

```bash
kubectl get all -n ecommerce
```

Check Pods:

```bash
kubectl get pods -n ecommerce
```

Check Services:

```bash
kubectl get svc -n ecommerce
```

Check PVC:

```bash
kubectl get pvc -n ecommerce
```

Check Ingress:

```bash
kubectl get ingress -n ecommerce
```

Check HPA:

```bash
kubectl get hpa -n ecommerce
```

Check RBAC:

```bash
kubectl get role,rolebinding,serviceaccount \
  -n ecommerce
```

Check CronJob:

```bash
kubectl get cronjob -n ecommerce
```

---

# 🧪 Kubernetes Audit

This project uses the Kubernetes Audit Assignment audit script.

Make it executable:

```bash
chmod +x audit.sh
```

Run:

```bash
./audit.sh ecommerce
```

The audit verifies Kubernetes concepts implemented in the application.

Detailed evidence and explanations are documented in:

```text
K8S-AUDIT.md
```

---

# 🔄 Application Update & Rollback

Build a new backend version:

```bash
docker build \
  -t ecommerce-backend:v2 \
  ./server
```

Load it into KIND:

```bash
kind load docker-image \
  ecommerce-backend:v2 \
  --name kind-audit
```

Update Deployment:

```bash
kubectl set image deployment/ecommerce-backend \
  backend=ecommerce-backend:v2 \
  -n ecommerce
```

Monitor rollout:

```bash
kubectl rollout status \
  deployment/ecommerce-backend \
  -n ecommerce
```

Rollback if required:

```bash
kubectl rollout undo \
  deployment/ecommerce-backend \
  -n ecommerce
```

---

# 🔐 Security Considerations

This project demonstrates basic Kubernetes security practices:

* Kubernetes Secrets for sensitive configuration
* Dedicated ServiceAccount
* RBAC Role
* RoleBinding
* Least-privilege permissions
* Resource limits
* Readiness and liveness probes
* No unrestricted cluster permissions for application workloads

For production, additional security controls should be considered:

* External Secrets Manager
* Image vulnerability scanning
* NetworkPolicies
* Pod Security Standards
* TLS certificates
* Non-root containers
* Image signing
* Admission policies

---

# 📊 Kubernetes Audit Evidence

The following commands can be used to collect evidence:

```bash
kubectl get nodes -o wide
```

```bash
kubectl get all -n ecommerce
```

```bash
kubectl get pvc -n ecommerce
```

```bash
kubectl get ingress -n ecommerce
```

```bash
kubectl get hpa -n ecommerce
```

```bash
kubectl get configmap -n ecommerce
```

```bash
kubectl get secrets -n ecommerce
```

```bash
kubectl get role,rolebinding,serviceaccount \
  -n ecommerce
```

```bash
kubectl get cronjob -n ecommerce
```

```bash
kubectl rollout history \
  deployment/ecommerce-backend \
  -n ecommerce
```

---

# 🧹 Cleanup

To remove the Kubernetes application:

```bash
kubectl delete namespace ecommerce
```

To delete the KIND cluster:

```bash
kind delete cluster --name kind-audit
```

---

# 📚 What I Learned

Through this project, I practiced:

* Containerizing a full-stack application
* Moving an application from Docker Compose to Kubernetes
* Kubernetes Deployments and ReplicaSets
* Service discovery
* Labels and selectors
* ConfigMaps and Secrets
* Persistent storage
* Health probes
* Resource management
* Rolling updates
* Rollbacks
* Ingress
* Horizontal Pod Autoscaling
* RBAC
* ServiceAccounts
* CronJobs
* Multi-node KIND clusters
* Kubernetes troubleshooting
* GitHub Actions
* Kubernetes audit and documentation

---

# 🎯 Project Goal

The goal of this project is to demonstrate that a real-world multi-tier application can be:

```text
Developed
   ↓
Containerized
   ↓
Deployed to Kubernetes
   ↓
Exposed through Ingress
   ↓
Configured securely
   ↓
Persisted using Kubernetes storage
   ↓
Monitored using probes
   ↓
Scaled using HPA
   ↓
Controlled using RBAC
   ↓
Updated using Rolling Updates
   ↓
Recovered using Rollbacks
   ↓
Validated through CI/CD
```

---

# 👩‍💻 Author

**Tejswini Maingade**

DevOps / Cloud Engineer — Aspiring

### GitHub

https://github.com/tejswini-maingade

### Project Repository

https://github.com/tejswini-maingade/ecommerce-app

---

# ⭐ Acknowledgements

This Kubernetes audit implementation is based on the **Kubernetes Audit Assignment by Shubham Londhe** and the concepts covered through the DevOps learning journey.

Special thanks to **Shubham Londhe** for the guidance and hands-on Kubernetes learning.

---

## 📌 Kubernetes Audit Status

```text
┌─────────────────────────────────────────────┐
│        KUBERNETES AUDIT STATUS              │
├─────────────────────────────────────────────┤
│ Deployment + ReplicaSet       ✅            │
│ Services                      ✅            │
│ Namespace                     ✅            │
│ Labels & Selectors            ✅            │
│ Rolling Update + Rollback     ✅            │
│ ConfigMap                     ✅            │
│ Secret                        ✅            │
│ Resource Requests & Limits    ✅            │
│ Liveness & Readiness          ✅            │
│ PersistentVolumeClaim         ✅            │
│ Ingress                       ✅            │
│ Multi-node KIND               ✅            │
│ HPA                           ✅            │
│ RBAC + ServiceAccount         ✅            │
│ CronJob                       ✅            │
│ GitHub Actions                ✅            │
└─────────────────────────────────────────────┘
```

**Kubernetesized. Audited. Documented. 🚀**
