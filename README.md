<div align="center">
  <img height="300" src="./logo.svg">
</div>

> **S**elf-hosted **now** deployments

Enjoy effortless deployments with a clone* of [now](https://github.com/zeit/now-cli) on your own hardware.

### Getting started

- Deploy the [snow server]().
- `npm i -g snow-cli`
- `snow`

### *Supported commands

Without arguments, deploys just like `now`.

| Support | Command                | Description       |
|---------|------------------------|-------------------|
| :x:     | `alias`                | Alias deployment  |
| :x:     | `deploy`               | Deploy            |
| :x:     | `domains`              | List domains      |
| :x:     | `domains add [domain]` | Add domain        |
| :x:     | `domains rm [domain]`  | Remove domain     |
| :x:     | `login`                | Login             |
| :x:     | `logout`               | Logout            |
| :x:     | `ls`                   | List deployments  |
| :x:     | `rm [name]`            | Remove deployment |

### Flags

| Support | Command | Flag            | Description          |
|---------|---------|-----------------|----------------------|
| :x:     | all     | --token [token] | Authentication token |
| :x:     | login   | --host [host]   | Snow server hostname |