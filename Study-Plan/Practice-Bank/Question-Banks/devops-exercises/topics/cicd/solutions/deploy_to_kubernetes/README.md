# devops-exercises: cicd / solutions/deploy_to_kubernetes/README.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/cicd/solutions/deploy_to_kubernetes/README.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Deploy to Kubernetes

Note: this exercise can be solved in various ways. The solution described here is just one possible way.

1. Install Jenkins on one system (follow up the standard Jenkins installation procedure)
2. Deploy Kubernetes on a remote host (minikube can be an easy way to achieve it)
3. Create a simple web app or [page](https://github.com/bregman-arie/devops-exercises/blob/master/topics/cicd/solutions/deploy_to_kubernetes/html)

4. Create Kubernetes [resources](https://github.com/bregman-arie/devops-exercises/blob/master/topics/cicd/solutions/deploy_to_kubernetes/helloworld.yml) - Deployment, Service and Ingress (for HTTPS access)
5. Create an [Ansible inventory](https://github.com/bregman-arie/devops-exercises/blob/master/topics/cicd/solutions/deploy_to_kubernetes/inventory) and insert the address of the Kubernetes cluster
6. Write [Ansible playbook](https://github.com/bregman-arie/devops-exercises/blob/master/topics/cicd/solutions/deploy_to_kubernetes/deploy.yml) to deploy the Kubernetes resources and also generate 
7. Create a [pipeline](https://github.com/bregman-arie/devops-exercises/blob/master/topics/cicd/solutions/deploy_to_kubernetes/Jenkinsfile)

8. Run the pipeline :)
9. Try to access the web app remotely
