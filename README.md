# Zliper

## Project Overview

Zliper is a robust, self-healing application designed for efficient file compression across various formats. It provides a user-friendly interface for uploading multiple files of different types and compressing them into a desired archive format. The application is built with a modern technology stack, emphasizing performance, scalability, and ease of deployment through containerization and orchestration.

**Key Features:**

* Supports compression of diverse file formats.
* Handles multiple file uploads simultaneously.
* Containerized architecture for consistency and portability.
* Orchestrated deployment using Kubernetes for resilience and scalability.

## Technology Stack

**Backend:**

* **Go 1.24:** Chosen for its performance, concurrency features, and suitability for building efficient backend services.

**Frontend:**

* **TypeScript:** Provides static typing for enhanced code quality and maintainability in the React application.
* **React:** A popular JavaScript library for building dynamic and responsive user interfaces.
* **Vite:** A fast build tool that significantly improves the frontend development experience.

**DevOps & Infrastructure:**

* **Docker:** Used for packaging the application components into portable containers.
* **Minikube:** A tool for running a single-node Kubernetes cluster locally, ideal for development and testing.
* **Kubernetes (K8s):** An open-source container orchestration platform for automating deployment, scaling, and management of containerized applications.

## Getting Started: Running Locally with Minikube

These instructions will guide you through setting up and running Zliper on your local machine using Docker and Minikube.

**Prerequisites:**

Ensure you have the following software installed on your system:

* [Docker](https://www.docker.com/get-started/)
* [Minikube](https://minikube.sigs.k8s.io/docs/start/)
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) (usually installed with Minikube)

**Installation Steps:**

1.  **Download the Project:**
    Clone the Zliper repository from GitHub:

    ```bash
    gh repo clone avinpy-255/zliper
    cd zliper
    ```

2.  **Configure Docker Environment for Minikube:**
    Point your local Docker environment to the Docker daemon inside the Minikube VM. This allows you to build images directly into Minikube's Docker registry.

    ```bash
    eval $(minikube docker-env)
    ```

3.  **Start Minikube:**
    Initiate your local Minikube cluster.

    ```bash
    minikube start
    ```

4.  **Build Docker Images:**
    Build the Docker images for both the backend and frontend services.

    ```bash
    docker build -t zlipper-backend -f Dockerfile.backend .
    docker build -t zlipper-frontend -f ui/Dockerfile.frontend ui
    ```

5.  **Load Images into Minikube:**
    Transfer the built Docker images into the Minikube cluster's image registry. This makes the images available for Kubernetes to deploy.

    ```bash
    minikube image load zlipper-backend
    minikube image load zlipper-frontend
    ```

6.  **Deploy to Kubernetes:**
    Apply the Kubernetes deployment and service configurations located in the `k8s` directory. This will create the necessary pods and services within your Minikube cluster.

    ```bash
    kubectl apply -f k8s/backend-deployment.yaml
    kubectl apply -f k8s/backend-service.yaml
    kubectl apply -f k8s/frontend-deployment.yaml
    kubectl apply -f k8s/frontend-service.yaml
    ```

7.  **Verify Deployment Status:**
    Check the status of the deployed pods to ensure they are running correctly.

    ```bash
    kubectl get pods
    ```
    Ensure all pods are in a `Running` state.

8.  **Access the Application:**
    Expose the services and retrieve their respective URLs.

    ```bash
    minikube service zlipper-frontend-service --url
    minikube service zlipper-backend-service --url
    ```

    The output will provide the URLs to access the frontend and backend services. Typically, they will be similar to:

    * **Frontend:** `http://192.168.49.2:30080`
    * **Backend:** `http://192.168.49.2:30081`

    Open the frontend URL in your web browser to access the Zliper application.
