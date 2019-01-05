<div align="center">
  <img height="300" src="./logo.svg">
</div>

> :snowflake: **S**elf-hosted **now** deployments

Enjoy effortless deployments with a clone of [now][now] on a cloud of your choosing.

### Features

- ⚡️ Deploy docker images via `snow` (or `snow deploy`)
- 🔒 Auto-configured SSL
- 🔃 Auto-scaling

### This is Magic 🔮

No, it isn't. This CLI abstracts away the complexities of using [Kubernetes], [cert-manager], [Kaniko], and a private [Docker Registry] together, replicating the functionality provided by `now`.

### Getting started

```
> npm i -g @snowjs/cli

# Install CLI tools
> snow install

# Create your kubernetes cluster (GCP)
> snow create

# Create a DNS 'A' record (e.g., myapp.com A 1.2.3.4)

# Deploy
> snow
```

### Supported commands

| Support            | Command                      | Description       |
| ------------------ | ---------------------------- | ----------------- |
| :x:                | \<none\>                     | Create deployment |
| :x:                | `alias`                      | Alias deployment  |
| :x:                | `deploy`                     | Deploy            |
| :white_check_mark: | `domains [ls]`               | List domains      |
| :white_check_mark: | `domains add <domain>`       | Add domain        |
| :white_check_mark: | `domains rm <domain>`        | Remove domain     |
| :white_check_mark: | `login`                      | Login             |
| :white_check_mark: | `logout`                     | Logout            |
| :white_check_mark: | `ls`                         | List deployments  |
| :white_check_mark: | `rm <name>`                  | Remove deployment |
| :white_check_mark: | `scale <name> <min> [<max>]` | Scale deployment  |
| :white_check_mark: | `secrets [ls]`               | List secrets      |
| :white_check_mark: | `secrets add <key> <value>`  | Create secret     |
| :white_check_mark: | `secrets rm <key>`           | Remove secret     |

### New commands

| Command  | Description                     |
| -------- | ------------------------------- |
| `create` | Run once to create cluster      |
| `ip`     | Get IP Address of Load Balancer |

### Tell me more

The essential CLI commands to understand are `snow create` and `snow deploy`.

```
snow create
```

Under the hood, `snow`'s simple CLI is served by a Kubernetes cluster. Here's what happens when you run `snow create`:

- You are authenticated to the cloud provider of your choosing.
- A Kubernetes cluster is created.
- [tiller][helm] is installed, which is used to install:
  - [cert-manager]
    - Will automatically watch your deployments and request new certificates for hostnames.
    - Request new certificates when they're closing to expiring and seamlessly update in production.
  - [ingress-nginx]
    - Used for mapping hostnames to deployments.
    - All HTTP traffic is permanently redirected (HTTP 308) to HTTPS.
    - SSL terminiation occurs prior to requests reaching deployments.

```
snow deploy
```

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

```
snow domains [ls]
```

List all configured domain names.

```
snow domains add <domain>
```

Verifies DNS records are configure properly for `<domain>`. Creates rule to redirect traffic from `<domain>` to the [default backend]. Requests an SSL certificate, if one is not available, and sets up SSL termination.

```
snow domains rm <domain>
```

Removes any traffic redirect rules. Removes SSL termination with the Let's Encrypt SSL certificate for `<domain>` (the [default certificate] will be used instead). The Let's Encrypt SSL certificate will remain persistented. Traffic from `<domain>` will redirect to the [default backend].

```
snow ip
```

Prints the IP address of your cluster.

### Dependencies

The following CLI tools (installable via `snow install`) are necessary to orchestrate the entire end-to-end process, from Kubernetes cluster creation to managing your deployments:

- `kubectl` (for managing deployments, secrets)
- `helm` (for installing [tiller], [cert-manager], and [ingress-nginx] on your cluster)
- CLI tool for your cloud provider (e.g., `gcloud`).

If running Kubernetes locally on Minikube, you will additionally need these cli tools:

- `docker` (for running local registry)
- `minikube` (for running Kubernetes locally)
- `virtualbox` (for creating docker images)

[cert-manager]: https://github.com/jetstack/cert-manager
[default backend]: https://kubernetes.github.io/ingress-nginx/user-guide/default-backend/
[default certificate]: https://kubernetes.github.io/ingress-nginx/user-guide/tls/#default-ssl-certificate
[docker registry]: https://github.com/helm/charts/tree/master/stable/docker-registry
[now]: https://github.com/zeit/now-cli
[ingress]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[ingress-nginx]: https://github.com/kubernetes/ingress-nginx
[kaniko]: https://github.com/GoogleContainerTools/kaniko
[kubernetes]: https://kubernetes.io/
[helm]: https://docs.helm.sh/
[docker]: https://www.docker.com/
[letsencrypt]: https://letsencrypt.org/
[minikube]: https://kubernetes.io/docs/setup/minikube/
