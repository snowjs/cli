# CLI Commands

Below is a description of each command. While you normally won't need exposure to the implementation details of each command, having a working knowledge of Kubernetes will be beneficial in understanding their behavior.

## snow alias [ls]

List all aliases (hostnames that map to deployments).

## snow alias set \<deployment\> \<alias\>

Configures your Kubernetes cluster so hostname `alias` points to a deployment named `deployment`.

## snow alias rm \<alias\>

Remove host name `alias` from any deployment in may point to, and any associated SSL configuration for `alias`. If you continue to have a DNS A record for `alias` that points to your Kubernetes cluster, all responses for hostname `alias` will be served with the [default certificate].

## snow certs [ls]

Lists all certificates.

## snow certs issue \<cn\> [\<cn\>]

Creates a certificate with the first common name (`cn`) listed. The first and all subsequent common names are also listed in the certificate's Subject Alternative Names (SANs) section. This allows you to create a single certificate for multiple domain names.

## snow certs rm \<cn\>

Delete a Kubernetes `certificate` object. Does _not_ delete the Kubernetes `secret` holding the certificate/private key pair.

## snow create

Under the hood, `snow`'s simple CLI is served by a Kubernetes cluster. Here's what happens when you run `snow create`:

- You are authenticated to the cloud provider of your choosing.
- A Kubernetes cluster is created.
- [tiller][helm] is installed, which is used to install:
  - [cert-manager]
    - Will automatically watch your deployments and request new certificates for hostnames.
    - Request new certificates when they're closing to expiring and seamlessly update in production.
  - [ingress-nginx]
    - Installing ingress-nginx will instantiate a load balancer, e.g., on GCP this instantiate a [TCP Proxy Load Balancer].
    - The nginx controller is a Kubernetes object of type `service`.
    - The type of service is `LoadBalancer`.
    - Used for mapping hostnames to deployments.
    - All HTTP traffic is permanently redirected (HTTP 308) to HTTPS.
    - SSL terminiation occurs prior to requests reaching deployments.

## snow [deploy]

Also aliased as `snow`. Your current directory must have both `Dockerfile` and `now.json` files. Example `now.json`:

```json
{
  "name": "myapp", // required
  "alias": ["api.myapp.com", "myapp.com"],
  "files": ["server.js"]
}
```

The deployment process:

- The files listed in `now.json` plus `Dockerfile` (collectively referred to as the "build context") are assembled into a tar archive.
- [Kaniko] creates a Docker image from the build context, and pushes it to the private Docker registry in your Kubernetes cluster.
- A Kubernetes `deployment` resource is created for your image.
- A Kubernetes `service` resource exposes your deployment.
- A Kubernetes `ingress` resource maps hostnames (listed as `alias` array in now.json) to the service.
- [cert-manager] continually inspects ingresses, so if a deployment needs SSL certificates, they will be generated upon deployment.

For your domain name to be resolvable by Kubernetes, you **must**:

- create a DNS `A` record, which points to the IP Address of your load balancer (which can be found via `snow ip`).
- Alias the domain name to a deployment.

## snow domains [ls]

List all configured domain names.

## snow domains add \<domain\>

Verifies DNS records are configure properly for `domain`. Creates rule to redirect traffic from `domain` to the [default backend]. Requests an SSL certificate, if one is not available, and sets up SSL termination.

## snow domains rm \<domain\>

Removes any traffic redirect rules. Removes SSL termination with the Let's Encrypt SSL certificate for `domain` (the [default certificate] will be used instead). The Let's Encrypt SSL certificate will remain persistented. Traffic from `domain` will redirect to the [default backend].

## snow ip

Prints the IP address of your cluster's load balancer. You'll need this for configuring DNS `A` records that point to your load balancer.

## snow login

Asks which cloud provider you are using, and configures your kube config file (typically at `~/.kube/config`). Since you will need credentials to your Kubernetes cluster to perform operations on it, you must login (or have a properly configured kube file) prior to running snow commands.

## snow logout

Remove all credentials from your kube config file (typically at `~/.kube/config`).

## snow ls

List all deployments.

## snow rm \<name\>

Deplete deployment `name`.

## snow scale \<deployment\> \<min\> [\<max\>]

Configure a deployment named `deployment` to scale to a `min` / `max` number of instances. If no `max` is specified, the `min` is used as the `max`.

## snow secrets [ls]

List all secrets. This will only show secrets created by the snow API, which are annotated in Kubernetes with label `snowsecret=true`.

## snow secrets add \<key\> \<value\>

Create a secret named `key`.

## snow secrets rename \<old-key\> \<new-key\>

Rename a secret from `old-key` to `new-key`. In Kubernetes, this means removing the old key, and creating a new key with identical info.

## snow secrets rm \<key\>

Delete a secret with name `key`.

[cert-manager]: https://github.com/jetstack/cert-manager
[default backend]: https://kubernetes.github.io/ingress-nginx/user-guide/default-backend/
[default certificate]: https://kubernetes.github.io/ingress-nginx/user-guide/tls/#default-ssl-certificate
[helm]: https://docs.helm.sh/
[ingress]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[ingress-nginx]: https://github.com/kubernetes/ingress-nginx
[kaniko]: https://github.com/GoogleContainerTools/kaniko
[minikube]: https://kubernetes.io/docs/setup/minikube/
[tcp proxy load balancer]: https://cloud.google.com/load-balancing/docs/choosing-load-balancer
