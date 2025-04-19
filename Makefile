# Makefile for Zlipper Local CI/CD

.PHONY: build deploy clean watch

build:
	@echo "Building images..."
	eval $(minikube docker-env) && docker build -t zlipper-backend -f Dockerfile.backend --no-cache .
	eval $(minikube docker-env) && docker build -t zlipper-frontend -f ui/Dockerfile.frontend --no-cache ui
	@echo "Images built successfully."

deploy:
	@echo "Deploying to Minikube..."
	kubectl apply -f k8s/backend-deployment.yaml
	kubectl apply -f k8s/backend-service.yaml
	kubectl apply -f k8s/frontend-deployment.yaml
	kubectl apply -f k8s/frontend-service.yaml
	@echo "Deployment complete."

clean:
	@echo "Cleaning up..."
	# Add any cleanup tasks here (e.g., deleting old images)
	@echo "Cleanup complete."

watch:
	go run watcher.go

all: build deploy
	@echo "All tasks completed."
