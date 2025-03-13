#
# Deploys all microservices to a Kubernetes instance.
#
# Usage:
#
#   ./deploy/hvac-enze/deploy.sh
#
# 
# Deploy containers to Kubernetes.
#
# Don't forget to change kubectl to your production Kubernetes instance
#
#export KUBECONFIG=~/.kube/config.k3s

#../../nodes-setup.sh
kubectl config use-context k3s-local
kubectl apply -f 0-ns.yaml
kubectl apply -f 1-configmap.yaml
kubectl apply -f 2-app.yaml
kubectl apply -f 3-strapi.yaml
kubectl apply -f 4-ingress.yaml
