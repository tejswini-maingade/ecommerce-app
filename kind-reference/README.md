# kind cluster for the assignment

3 nodes (1 control-plane, 2 workers). Ports 80 and 443 on your laptop are forwarded to the control-plane node, where ingress-nginx will run.

Needs Docker, `kind` and `kubectl`. Install steps are in the kubestarter repo: [kind-cluster/install.sh](https://github.com/LondheShubham153/kubestarter/blob/main/kind-cluster/install.sh).

## Create

```bash
kind create cluster --config kind/kind-config.yaml
kubectl get nodes     # 3 nodes, all Ready
```

`extraPortMappings` and node labels can only be set at creation. If you forget them, delete the cluster and create it again.

If creation fails with `port is already allocated`, something on your machine is using 80 or 443. Stop it, or change `hostPort` in the config (for example 8080 and 8443) and use `http://your-host.localtest.me:8080` later.

## Ingress (ingress-nginx)

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.15.1/deploy/static/provider/kind/deploy.yaml

# The manifest does not pin the controller to the node that has ports 80/443.
# On a multi-node cluster it can land on a worker and nothing answers. Pin it:
kubectl -n ingress-nginx patch deployment ingress-nginx-controller --type=merge \
  -p '{"spec":{"template":{"spec":{"nodeSelector":{"ingress-ready":"true"}}}}}'

kubectl -n ingress-nginx wait --for=condition=ready pod -l app.kubernetes.io/component=controller --timeout=180s
kubectl -n ingress-nginx get pod -o wide      # should be on the control-plane node
```

Use `ingressClassName: nginx` in your Ingress. `*.localtest.me` resolves to 127.0.0.1, so you do not need to edit `/etc/hosts`.

Note: the ingress-nginx project was archived in March 2026. It still works and it is what the course used. The current kind docs show another route (cloud-provider-kind): <https://kind.sigs.k8s.io/docs/user/ingress/>. Either is fine for this assignment.

## metrics-server (needed for HPA and `kubectl top`)

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl -n kube-system patch deployment metrics-server --type=json \
  -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
kubectl -n kube-system rollout status deployment metrics-server
kubectl top nodes     # works after about a minute
```

## Load local images

```bash
docker build -t myapp:1.0 .
kind load docker-image myapp:1.0 --name audit
```

Use a real tag, not `latest`. With `latest` Kubernetes tries to pull from a registry and fails with `ErrImagePull`. Load every new tag again after each rebuild.

## Delete

```bash
kind delete cluster --name audit
```
