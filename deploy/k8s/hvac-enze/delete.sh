# 
# Remove containers from Kubernetes.
#
# Usage:
#
#   ./delete.sh
#

kubectl config use-context k3s-local
kubectl delete -f 4-ingress.yaml
kubectl delete -f 3-strapi.yaml
kubectl delete -f 2-app.yaml
kubectl delete -f 1-configmap.yaml
kubectl delete -f 0-ns.yaml