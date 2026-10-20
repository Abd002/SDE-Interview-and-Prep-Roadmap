# devops-exercises: kubernetes / solutions/services_01_solution.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/kubernetes/solutions/services_01_solution.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Services 01 - Solution

```
kubectl run nginx --image=nginx --restart=Never --port=80 --labels="app=dev-nginx"

cat << EOF > nginx-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: dev-nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9372
EOF
```
