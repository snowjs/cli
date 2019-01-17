# Snow vs Now

There are tradeoffs to using `snow` and `now`.

## Features

| Feature                        | ❄ snow             | 𝚫 now                 | Details                                          |
| ------------------------------ | ------------------ | --------------------- | ------------------------------------------------ |
| Doesn't require DNS TXT record | :white_check_mark: | :x:                   | Needed by now to validate domain ownership.      |
| Autoscaling                    | :white_check_mark: | :white_check_mark: \* | [Now plans] Pro & Advanced only.                 |
| SSL Termination                | :white_check_mark: | :white_check_mark:    | Certificates self-renew; both use Let's Encrypt. |
| Wildcard Certificates          | :x:                | :white_check_mark: \* | Supported on Now when using Zeit's name servers. |
| Multi-region deployments       | :x:                | :white_check_mark:    | Snow: Dependent upon [Multicluster SIG].         |
| Internal deployments           | :white_check_mark: | :x:                   | Deploy internally accessible Dockerfiles.        |
| HTTP(S)/WS(S) connections      | :white_check_mark: | :white_check_mark:    | Insecure connections are upgraded.               |
| TCP connections                | :white_check_mark: | :x:                   | Useful for deploying things like Redis.          |
| Serverless lambdas             | :x:                | :white_check_mark: \* | Now v2 only.                                     |

### Multi-region deployments

Now's Anycast DNS service and load balancers allows serving content as close as possible to users. Since the load balancer implementations used by Kubernetes provide similar functionality (e.g., [Google Cloud Load Balancing]), it may be possible to provide this functionality in the future when the [Multicluster SIG] API's reach general availability. A beta [multicluster ingress](`kubemci`) serves as a working proof-of-concept.

### Internal deployments

On snow, each deployment is associated with a kubernetes service. Each service is assigned an address from the service [address range] (e.g., `10.0.0.0/20`). You can use this IP Address to talk between deployments, without exposing the deployment on the public internet.

On some cloud providers, by keeping traffic between deployments in the same zone/region, you might save on network ingress/egress costs as well.

### Serverless lambdas

Today, Serverless lambdas are out of scope for `snow`.

## Operating Cost

Costs will vary depend on which cloud you choose. These are minimal costs-- in a production setting, you might want a minimum of 2 compute instances, for example, to ensure high availability.

Cost table for Google Cloud Plaform in region `us-east4`.

| Resource                                  | Count | Cost       |
| ----------------------------------------- | ----- | ---------- |
| `g1-small` compute instance (1vCPU/1.7GB) | 1     | \$14.77    |
| Load balancer w/ 100GB Network Ingress    | 1     | \$21.34    |
| 100GB Network Egress - Americas           | 100GB | \$11.88    |
| Persistent Disk                           | 8GB   | \$0.35     |
| Total                                     |       | \$48.34/mo |

Cost table for Digital Ocean in `nyc1`:

| Resource                                    | Count | Cost       |
| ------------------------------------------- | ----- | ---------- |
| `s-1vcpu-2gb` standard droplet (1vCPU/2GB)  | 1     | \$10.00    |
| Load Balancer w/ ∞GB Network Ingress        | 1     | \$10.00    |
| 100GB Network Egress (first 1000GB/mo free) | 100GB | \$0.00     |
| Block Storage (\$0.10/GB/mo)                | 8GB   | \$0.80     |
| Total                                       |       | \$20.80/mo |

[multicluster ingress]: https://github.com/GoogleCloudPlatform/k8s-multicluster-ingress
[google cloud load balancing]: https://cloud.google.com/load-balancing/docs/choosing-load-balancer
[address range]: https://www.mediawiki.org/wiki/Help:Range_blocks#Table_of_sample_ranges
[now plans]: https://zeit.co/pricing/v1
[multicluster sig]: https://github.com/kubernetes/community/tree/master/sig-multicluster
