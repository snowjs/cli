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

No, it isn't. This CLI abstracts away the complexities of using [Kubernetes], [Traefik], [Kaniko], and a private [Docker Registry] together, replicating the functionality provided by `now`.

### Getting started

```
npm i -g @snowjs/cli

# Install CLI tools
snow install

# Create your kubernetes cluster (GCP)
snow create

# Create a DNS 'A' record (e.g., myapp.com A 1.2.3.4)

# Deploy your app 
snow
```

### Supported commands

| Support            | Command                     | Description       |
|--------------------|-----------------------------|-------------------|
| :x:                | \<none\>                    | Create deployment |
| :x:                | `alias`                     | Alias deployment  |
| :x:                | `deploy`                    | Deploy            |
| :white_check_mark: | `domains`                   | List domains      |
| :x:                | `domains add [domain]`      | Add domain        |
| :x:                | `domains rm [domain]`       | Remove domain     |
| :white_check_mark: | `login`                     | Login             |
| :white_check_mark: | `logout`                    | Logout            |
| :white_check_mark: | `ls`                        | List deployments  |
| :white_check_mark: | `rm [name]`                 | Remove deployment |
| :white_check_mark: | `scale [name] [min]`        | Scale deployment  |
| :white_check_mark: | `scale [name] [min] [max]`  | Scale deployment  |
| :white_check_mark: | `secrets ls`                | List secrets      |
| :white_check_mark: | `secrets add [key] [value]` | Create secret     |
| :white_check_mark: | `secrets rm [key]`          | Remove secret     |

### Tell me more

Under the hood, `snow`'s simple CLI is served by a Kubernetes cluster. When you create your cluster via `snow`, we install [tiller][helm], which is used to install [traefik] as an [ingress object][ingress], which (1) automanages the SSL certificate lifecycle and (2) maps aliases to deployments. SSL terminiation occurs prior to requests reaching deployments.

When you create a deployment, your project must have `Dockerfile` and `now.json` files. The `now.json` file must specify both a `name` and  `files` array. On Kubernetes, an image is created from the Dockerfile, and pushed to a Docker registry, and deployed. Aliases from `now.json` will point to the deployment. If necessary, new SSL certificates will be created.

For your domain name to be resolvable by Kubernetes, you must create a DNS `A` record, which points to the IP Address of your [traefik] ingress.

The following CLI tools (installable via `snow install`) are necessary to orchestrate the entire end-to-end process, from Kubernetes cluster creation to managing your deployments:

- `kubectl` (for managing deployments, secrets)
- `helm` (for installing [tiller][helm] and [traefik] on your cluster)
- CLI tool for your cloud provider (e.g., `gcloud`).

If running Kubernetes locally on Minikube, you will additionally need these cli tools:

- `docker` (for running local registry)
- `minikube` (for running Kubernetes locally)
- `virtualbox` (for creating docker images)

[docker registry]: https://github.com/helm/charts/tree/master/stable/docker-registry
[now]: https://github.com/zeit/now-cli
[ingress]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[kaniko]: https://github.com/GoogleContainerTools/kaniko
[kubernetes]: https://kubernetes.io/
[helm]: https://docs.helm.sh/
[docker]: https://www.docker.com/
[letsencrypt]: https://letsencrypt.org/
[minikube]: https://kubernetes.io/docs/setup/minikube/
[traefik]: https://traefik.io/