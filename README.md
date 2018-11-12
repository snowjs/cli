<div align="center">
  <img height="300" src="./logo.svg">
</div>

> :snowflake: **S**elf-hosted **now** deployments 

Enjoy effortless deployments with a clone of [now](https://github.com/zeit/now-cli) on your own hardware.

### Getting started

```
curl -sSL https://get.snowjs.app/ | sh
npm i -g snow-cli
snow
```

### Supported commands

Without arguments, deploys just like `now`.

| Support            | Command                     | Description       |
|--------------------|-----------------------------|-------------------|
| :x:                | \<none\>                    | Create deployment |
| :x:                | `alias`                     | Alias deployment  |
| :x:                | `deploy`                    | Deploy            |
| :x:                | `domains`                   | List domains      |
| :x:                | `domains add [domain]`      | Add domain        |
| :x:                | `domains rm [domain]`       | Remove domain     |
| :x:                | `login`                     | Login             |
| :x:                | `logout`                    | Logout            |
| :white_check_mark: | `ls`                        | List deployments  |
| :x:                | `rm [name]`                 | Remove deployment |
| :white_check_mark: | `secrets ls`                | List secrets      |
| :white_check_mark: | `secrets add [key] [value]` | Create secret     |
| :white_check_mark: | `secrets rm [key]`          | Remove secret     |