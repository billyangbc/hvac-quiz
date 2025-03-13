# install quiz app on k8s

## create a secret to pull image from docker.io
```sh
k create secret docker-registry my-dockerhub-secret \              
--docker-server=https://index.docker.io/v1 --docker-username=billyangbc \
--docker-email=bill.yang@live.ca \
--docker-password=<password> \
-n hvac-enze
```

## verify secret creation
```sh
k get secret -n hvac-enze
```

## create configmap file for environment variabes (1-configmap.yaml)
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: env
  namespace: hvac-enze
data:
  NODE_ENV: production
  ...
# other variables from the .env file...
```

## apply configmap and secret to k8s cluster in deploy tempate part:
```yaml
    spec:
      imagePullSecrets:
        - name: my-dockerhub-secret
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                - key: arch
                  operator: In
                  values:
                    - amd64
#                    - arm64
      containers:
        - image: billyangbc/quiz:app-latest
          name: quiz-app
          ports:
            - containerPort: 3000
              protocol: TCP
          env:
            - name: GOOGLE_CLIENT_ID
              valueFrom:
                configMapKeyRef:
                  key: GOOGLE_CLIENT_ID
                  name: env
```