# Zlipper
**Multi-format File Compression App**

Zlipper is a lightweight, high-performance file compression application built with Go and React. It supports multiple file types and compresses them efficiently into a single archive. Designed with containerization and cloud-native deployment in mind, Zlipper uses Docker and Minikube for local orchestration.

---

## Tech Stack

| Layer     | Technologies                           |
|-----------|----------------------------------------|
| Backend   | Go (v1.24), Gin Web Framework          |
| Frontend  | React, Vite, TypeScript, Tailwind CSS  |
| DevOps    | Docker, Kubernetes (Minikube)          |

---

## Features

- Upload and compress multiple file formats
- Responsive UI built with modern frontend tooling
- Optimized Go backend with concurrent file handling
- Containerized with Docker for ease of deployment
- Kubernetes-ready with manifests for Minikube

---

## Getting Started

### Pre-requisites
Ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)

---

### Clone the Repository

```bash
git clone https://github.com/avinpy-255/zliper.git
cd zliper
```

---

### Setup Minikube Docker Environment

Before building Docker images, run:

```bash
eval $(minikube docker-env)
```

Then start Minikube:

```bash
minikube start
```

---

### Build Docker Images

```bash
docker build -t zlipper-backend -f Dockerfile.backend .
docker build -t zlipper-frontend -f ui/Dockerfile.frontend ui
```

---

### Load Images into Minikube

```bash
minikube image load zlipper-backend
minikube image load zlipper-frontend
```

---

### Deploy to Minikube

```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

---

### Verify the Deployment

Check if the pods are running:

```bash
kubectl get pods
```

---

### Access the Services

Expose services using:

```bash
minikube service zlipper-frontend-service --url
minikube service zlipper-backend-service --url
```

- **Frontend URL:** [http://192.168.49.2:30080](http://192.168.49.2:30080)
- **Backend URL:** [http://192.168.49.2:30081](http://192.168.49.2:30081)

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/avinpy-255/zliper/issues).