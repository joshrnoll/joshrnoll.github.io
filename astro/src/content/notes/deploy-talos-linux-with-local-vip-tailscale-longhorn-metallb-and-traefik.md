---
date: 2025-05-11T07:10:17-04:00
draft: false
title: Deploy Talos Linux with Local VIP, Tailscale, Longhorn, MetalLB and Traefik
tags:
  - kubernetes
  - talos
  - tailscale
  - traefik
  - longhorn
  - metallb
---

***I wrote a dumb little script that does most of this:***

https://github.com/joshrnoll/talos-scripts
### Prerequisites
1. Install talosctl:
```
brew install siderolabs/tap/talosctl
```
2. Boot a VM to Talos ISO https://www.talos.dev/v1.9/introduction/getting-started/
3. Decide on a cluster endpoint IP -- this will be the VIP of the cluster. This IP should be within the same subnet that your nodes will be in (providing layer2 connectivity)
4. Decide on a cluster name. This is just a friendly name for your cluster like 'nollhomelab'
### Generate Config
1. Go to factory.talos.dev to generate the image with desired extensions -- in this case, iscsi-tools and tailscale
2. Copy the schematic into a file **schematic.yaml**
```YAML
customization:
    systemExtensions:
        officialExtensions:
            - siderolabs/iscsi-tools
            - siderolabs/tailscale
```
3. Use this file to get the schematic ID from factory.talos.dev via curl
```
curl -X POST --data-binary @schematic.yaml https://factory.talos.dev/schematics
```
4. Then copy the ID from the output:
```
{"id":"e2e3b54334c85fdef4d78e88f880d185e0ce0ba0c9b5861bb5daa1cd6574db9b"}
```
Using this you can construct the install image url in this format:
```
factory.talos.dev/installer/{{ schematic ID }}:{{ talos version }}

example:

factory.talos.dev/installer/e2e3b54334c85fdef4d78e88f880d185e0ce0ba0c9b5861bb5daa1cd6574db9b:v1.9.2
```
5. Generate the config with:
```
talosctl gen config <name-of-your-cluster> https://<ip-address-of-first-node>:6443 --install-image=factory.talos.dev/installer/e2e3b54334c85fdef4d78e88f880d185e0ce0ba0c9b5861bb5daa1cd6574db9b:v1.9.2
```
7. In the controlplane.yaml file, add the network interface configuration under the **machine: network: section** -- it will look like this:
```YAML
    # be sure to remove {} after network:
    network:
        interfaces:
            - deviceSelector:
                physical: true
              dhcp: true
              vip:
                ip: 10.0.30.25
```
*note that the 'physical: true' section will select any physical network hardware -- this works when the machine has only one network interface

*from the docs -- Since VIP functionality relies on etcd for elections, the shared IP will not come alive until **after you have bootstrapped Kubernetes**.* 

### Apply and bootsrap
1. Apply the controlplane config to the first control node
```
talosctl apply-config -f controlplane.yaml --insecure -n <ip-address-of-first-node>
```
2. Bootstrap the cluster
```
talosctl bootstrap -n <ip-address-of-node> -e <ip-address-of-node> --talosconfig=./talosconfig
```
3. Get kubeconfig
```
talosctl kubeconfig -n <ip-address-of-node> -e <ip-address-of-VIP> --talosconfig=./talosconfig
```

### Install Longhorn
1. Apply longhorn mounts
```
talosctl patch machineconfig -p @longhorn-mounts.yaml -n <node-ip>
```
2. Create longhorn namespace and add pod security labels
```
kubectl create ns longhorn-system && kubectl label namespace longhorn-system pod-security.kubernetes.io/enforce=privileged
```
4. Install longhorn
```
kubectl apply -f https://raw.githubusercontent.com/longhorn/longhorn/v1.7.2/deploy/longhorn.yaml
```
3. Apply longhorn pod security policies
```
kubectl apply -f https://raw.githubusercontent.com/longhorn/longhorn/master/deploy/podsecuritypolicy.yaml
```
4. Verify longhorn was installed
```
kubectl get pods \
--namespace longhorn-system \
--watch
```
5. Output should look like this
```
NAME                                                READY   STATUS    RESTARTS   AGE
longhorn-ui-b7c844b49-w25g5                         1/1     Running   0          2m41s
longhorn-manager-pzgsp                              1/1     Running   0          2m41s
longhorn-driver-deployer-6bd59c9f76-lqczw           1/1     Running   0          2m41s
longhorn-csi-plugin-mbwqz                           2/2     Running   0          100s
csi-snapshotter-588457fcdf-22bqp                    1/1     Running   0          100s
csi-snapshotter-588457fcdf-2wd6g                    1/1     Running   0          100s
csi-provisioner-869bdc4b79-mzrwf                    1/1     Running   0          101s
csi-provisioner-869bdc4b79-klgfm                    1/1     Running   0          101s
csi-resizer-6d8cf5f99f-fd2ck                        1/1     Running   0          101s
csi-provisioner-869bdc4b79-j46rx                    1/1     Running   0          101s
csi-snapshotter-588457fcdf-bvjdt                    1/1     Running   0          100s
csi-resizer-6d8cf5f99f-68cw7                        1/1     Running   0          101s
csi-attacher-7bf4b7f996-df8v6                       1/1     Running   0          101s
csi-attacher-7bf4b7f996-g9cwc                       1/1     Running   0          101s
csi-attacher-7bf4b7f996-8l9sw                       1/1     Running   0          101s
csi-resizer-6d8cf5f99f-smdjw                        1/1     Running   0          101s
instance-manager-b34d5db1fe1e2d52bcfb308be3166cfc   1/1     Running   0          114s
engine-image-ei-df38d2e5-cv6nc   
```

### Install Nginx Ingress for Longhorn UI

1. Install the Nodeport version of nginx ingress:
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/baremetal/deploy.yaml
```
https://kubernetes.github.io/ingress-nginx/deploy/#bare-metal-clusters
https://kubernetes.github.io/ingress-nginx/deploy/baremetal/

2. Create a basic auth file:
```
USER=<USERNAME_HERE>; PASSWORD=<PASSWORD_HERE>; echo "${USER}:$(openssl passwd -stdin -apr1 <<< ${PASSWORD})" >> auth
```
2. Create a secret:
```
kubectl -n longhorn-system create secret generic basic-auth --from-file=auth
```
3. Create an ingress manifest longhorn-ingress.yml
```YAML
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: longhorn-ingress
  namespace: longhorn-system
  annotations:
    # type of authentication
    nginx.ingress.kubernetes.io/auth-type: basic
    # prevent the controller from redirecting (308) to HTTPS
    nginx.ingress.kubernetes.io/ssl-redirect: 'false'
    # name of the secret that contains the user/password definitions
    nginx.ingress.kubernetes.io/auth-secret: basic-auth
    # message to display with an appropriate context why the authentication is required
    nginx.ingress.kubernetes.io/auth-realm: 'Authentication Required '
    # custom max body size for file uploading like backing image uploading
    nginx.ingress.kubernetes.io/proxy-body-size: 10000m
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - pathType: Prefix
        path: "/"
        backend:
          service:
            name: longhorn-frontend
            port:
              number: 80
```
4. Create the ingress
```
kubectl -n longhorn-system apply -f longhorn-ingress.yml
```
5. Get the ingress IP:
```
kubectl -n longhorn-system get ingress

NAME               CLASS   HOSTS   ADDRESS       PORTS   AGE
longhorn-ingress   nginx   *       10.0.30.176   80      45m
```
7. Get the nodeport from the nginx controller:
```
kubectl get service -n ingress-nginx

NAME                                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller             NodePort    10.111.203.49   <none>        80:30136/TCP,443:31606/TCP   16m
ingress-nginx-controller-admission   ClusterIP   10.108.52.190   <none>        443/TCP                      16m
```
6. Check connectivity by going to http://10.0.30.176:30136
### MetalLb
1. Install with:
```
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.9/config/manifests/metallb-native.yaml
```
2. Create an IP pool and L2 advertisement resource in a YAML file **metallb-config.yml**:
```
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: lab-pool
  namespace: metallb-system
spec:
  addresses:
  - 10.0.30.200-10.0.30.220
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: l2advertisement
  namespace: metallb-system
spec:
  ipAddressPools:
  - lab-pool
```
3. Run ```kubectl apply -f metallb-config.yml```
4. Services of type ```LoadBalancer``` should now have an external IP assigned from the address pool:
```
kubectl get services
NAME            TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
kubernetes      ClusterIP      10.96.0.1      <none>        443/TCP        8d
nginx-service   LoadBalancer   10.107.0.134   10.0.30.200   80:31000/TCP   6d23h
```

### Installing the Tailscale Kubernetes Operator
1. Create the following tags:
```
"tagOwners": {
   "tag:k8s-operator": [],
   "tag:k8s": ["tag:k8s-operator"],
}
```
3. Create an ***Oauth Client*** with *Devices Core* and *Auth Keys* scopes.
4. Add Tailscale helm repo:
```
helm repo add tailscale https://pkgs.tailscale.com/helmcharts && helm repo update
```
5. Install the Tailscale operator:
```
helm upgrade \
  --install \
  tailscale-operator \
  tailscale/tailscale-operator \
  --namespace=tailscale \
  --create-namespace \
  --set-string oauth.clientId="<OAauth client ID>" \
  --set-string oauth.clientSecret="<OAuth client secret>" \
  --wait
```
6. Create an authkey and kubernetes secret containing the authkey
```
apiVersion: v1
kind: Secret
metadata:
  name: tailscale-auth
stringData:
  TS_AUTHKEY: REDACTED
```
or from cli:
```
kubectl create secret generic tailscale-auth --from-literal=TS_AUTHKEY='REDACTED'
```
7. Create a tailscale-rbac.yml file with the following contents:
```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tailscale

---

apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: tailscale
rules:
  - apiGroups: [""]
    resourceNames: ["tailscale-auth"]
    resources: ["secrets"]
    verbs: ["get", "update", "patch"]

---

apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: tailscale
subjects:
  - kind: ServiceAccount
    name: tailscale
roleRef:
  kind: Role
  name: tailscale
  apiGroup: rbac.authorization.k8s.io

```
and run ```kubectl apply -f tailscale-rbac.yml``` 
8. Set the pod security context to allow privilege escalation for the tailscale namespace:
```
kubectl label namespace tailscale pod-security.kub
ernetes.io/enforce=privileged
```
### Traefik
- can use Docker installation and simply enable Kubernetes ingress as a provider?
- For helm values examples -- https://github.com/traefik/traefik-helm-chart/blob/master/EXAMPLES.md
1. Add helm repo (Requires helm -- ensure helm is installed):
```
helm repo add traefik https://helm.traefik.io/traefik
helm repo update
```
2. Create traefik namespace
```
kubectl create namespace traefik
```
3. Create values.yml file:
```YAML
---
image:
  repository: traefik
  tag: v3.3.3
  pullPolicy: IfNotPresent

globalArguments:
  - "--global.sendanonymoususage=false"
  - "--global.checknewversion=false"

ports:
  websecure:
    tls:
      enabled: true
      certResolver: cloudflare
  web:
    redirections:
      entryPoint:
        to: websecure
        scheme: https
        permanent: true  

persistence:
  enabled: true
  size: 128Mi
  storageClass: longhorn

deployment:
  initContainers:
    - name: volume-permissions
      image: busybox:latest
      command: ["sh", "-c", "touch /data/acme.json; chmod -v 600 /data/acme.json"]
      volumeMounts:
      - mountPath: /data
        name: data

service:
  enabled: true
  type: LoadBalancer
  annotations:
    tailscale.com/expose: "true"
  spec:
    loadBalancerClass: tailscale  

certificatesResolvers:
  cloudflare:
    acme:
      email: noll.joshua@outlook.com
      storage: /data/acme.json
      # caServer: https://acme-v02.api.letsencrypt.org/directory # prod (default)
      caServer: https://acme-staging-v02.api.letsencrypt.org/directory # staging
      dnsChallenge:
        provider: cloudflare
        #disablePropagationCheck: true # uncomment this if you have issues pulling certificates through cloudflare, By setting this flag to true disables the need to wait for the propagation of the TXT record to all authoritative name servers.
        #delayBeforeCheck: 60s # uncomment along with disablePropagationCheck if needed to ensure the TXT record is ready before verification is attempted 
        resolvers:
          - "1.1.1.1:53"
          - "1.0.0.1:53"

env:
  - name: CF_DNS_API_TOKEN
    valueFrom:
      secretKeyRef:
        key: apiKey
        name: cloudflare-api-token

extraObjects:
  - apiVersion: v1
    kind: Secret
    metadata:
      name: cloudflare-api-token
      namespace: traefik
    type: Opaque
    stringData:
      email: noll.joshua@outlook.com
      apiKey: REDACTED

logs:
  general:
    level: DEBUG # --> Change back to ERROR after testing
  access:
    enabled: false

```
5. Install traefik
```
helm install --namespace=traefik traefik traefik/traefik --values=values.yaml
```
6. Get Traefik's tailscale IP with:
```
kubectl get service -n traefik
NAME      TYPE           CLUSTER-IP     EXTERNAL-IP                                         PORT(S)                      AGE
traefik   LoadBalancer   10.98.226.75   100.115.176.29,traefik-traefik.mink-pirate.ts.net   80:32748/TCP,443:31958/TCP   26m
```
8. Deployment example:
```YAML
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8s-traefik-uptime-kuma
  namespace: uptime-kuma
  labels:
    app: k8s-traefik-uptime-kuma
spec:
  replicas: 1
  selector:
    matchLabels:
      app: k8s-traefik-uptime-kuma
  template:
    metadata:
      labels:
        app: k8s-traefik-uptime-kuma
    spec:
      containers:
      - name: k8s-traefik-uptime-kuma
        image: louislam/uptime-kuma
        ports:
        - containerPort: 3001
        volumeMounts: # Volume must be created along with volumeMount (see next below)
        - name: k8s-traefik-uptime-kuma-data
          mountPath: /app/data # Path within the container, like the right side of a docker bind mount -- /tmp/data:/app/data
      volumes: # Defines a volume that uses an existing PVC (defined below)
      - name: k8s-traefik-uptime-kuma-data
        persistentVolumeClaim:
          claimName: k8s-traefik-uptime-kuma-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: k8s-traefik-uptime-kuma-service
  namespace: uptime-kuma
spec:
  selector:
    app: k8s-traefik-uptime-kuma
  ports:
    - protocol: TCP
      port: 3001
      targetPort: 3001
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: k8s-traefik-uptime-kuma-ingress
  namespace: uptime-kuma
spec:
  rules:
  - host: "k8s-traefik-uptime-kuma.nollhome.casa"
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: k8s-traefik-uptime-kuma-service
            port:
              number: 3001
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: k8s-traefik-uptime-kuma-pvc
  namespace: uptime-kuma
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: longhorn # https://kubernetes.io/docs/concepts/storage/storage-classes/#default-storageclass
```
Traefik becomes the default ingress class, so no annotations are required on the ingress object. Ensure a DNS entry is created pointing k8s-traefik-uptime-kuma to Traefik's tailscale IP. You can now reach uptime-kuma in the browser via https://k8s-traefik-uptime-kuma.nollhome.casa
### Troubleshooting
#### Get tailscale logs:
```
talosctl logs ext-tailscale -e <ip-address of endpoint> -n <ip-address-of-node>
```
