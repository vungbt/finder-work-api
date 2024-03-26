## Node version

```bash
  Node 20.10.0
```

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# docker run
$ docker compose up -d

# models gen
$ yarn gen:prisma

# seed data
$ yarn seed:init

# development
$ yarn dev

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Structure

```bash
src
  - configs
    - constant.ts
    - types.ts
    - validation.ts
  - i18n
    - en
    - th
    - vi
  - modules
  - prisma
    - migrations
    - seed
  - types
  - utils
    - base
    - exception
    - helpers
    - pipes
    - plugins
```

## 
## Stay in touch

- Author - [Stable Bui](https://github.com/vungbt)

## License

Nest is [MIT licensed](LICENSE).
