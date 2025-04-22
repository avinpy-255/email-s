# Zliper
### Takes any kind of formats (multiple files) and compress it
##### Project overview
```
BACKEND
--------------------------------------------------------------------------------------------
go 1.24

FRONTEND
--------------------------------------------------------------------------------------------
Typescript
React
Vite

DEVOPS
--------------------------------------------------------------------------------------------
Docker
Minikube
```

### Run Locally
##### Lets assume you have installed 
```
Docker
Minikube
```

##### Then Start 
```
DOWNLOAD THE PROJECT LOCALLY 
---------------------------------------------------------------------------------------------
gh repo clone avinpy-255/zliper
cd zliper

```
#### Before Proceeding to the next step make sure you have to run this
```
eval $(minikube docker-env)
```
#### Then start the minikube
```
minikube start
```
```
```
```
```

##### After Downloading the project build the ```Docker``` image
###### run the following command
```
docker build -t zlipper-backend -f Dockerfile.backend .
docker build -t zlipper-frontend -f ui/Dockerfile.frontend ui

```

##### Add the image to the local minikube docker
```
minikube image load zlipper-backend
minikube image load zlipper-frontend

```
##### Deploy the K8s config in Minikube
```
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

```
##### Now Verify Deployment Status checking the pods is running or not
```
kubectl get pods

```
##### Exposing the urls 
```
minikube service zlipper-frontend-service --url
minikube service zlipper-backend-service --url

```
##### Frontend will be available on the port ```http://192.168.49.2:30080```
##### Backend will be available on the port ```http://192.168.49.2:30081```







