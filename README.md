<p align="center">
  <img src="https://raw.githubusercontent.com/jukkhop/kahvilat-app/master/kahvilat-ui/public/logo192.png" />
  <h3 align="center">Discover nearby cafeterias</h3>
  <h4 align="center">https://kahvilat.app</h4>
</p>

## Tools and libraries used

Miscellaneous

- AWS as cloud provider (API Gateway, CloudFront, ElastiCache, Lambda, Route53, S3, VPC)
- [Terraform](https://www.terraform.io/) for infrastructure-as-code
- [CircleCI](https://circleci.com/) for CI/CD automation
- [Cypress](https://www.cypress.io/) for end-to-end testing
- [Jest](https://jestjs.io/) for integration and unit testing
- [git-crypt](https://github.com/AGWA/git-crypt) for encryption

API

- Node, TypeScript, ESLint, Prettier
- Redis as a cache
- Serverless framework
- Docker (for local development only)

UI

- React, TypeScript, ESLint, Prettier
- `material-ui` as an UI framework
- `react-fontawesome` for icons
- `react-hook-form` as form library
- `react-router-dom` for routing
- `styled-components` for CSS-in-JS

## Local development

#### API

- Install [Node](https://nodejs.org/en/), [Docker](https://www.docker.com/get-started) and [Serverless](https://github.com/serverless/serverless#quick-start)
- Change directory `cd kahvilat-api`
- Up the cache `docker-compose up -d`
- Install deps `npm install`
- Run `npm run start`
- Run `curl http://localhost:3010/local/places` to verify that the API works as expected

#### UI

- Change directory `cd kahvilat-ui`
- Install deps `npm install`
- Create env file `cp .env.template .env` and adjust variables as needed
- Run `npm run start`
- Your browser should automatically open at http://localhost:3000/

## Cloud deployment

Environment-specific variables and secrets are kept in the `kahvilat-vault` folder. All variables are encrypted, make sure to run `git-crypt unlock` to decrypt them.

#### Manual deployment (infra)

- Install [Terraform](https://www.terraform.io/)
- Change directory `cd kahvilat-infra`
- Deploy `./deploy.sh <env>`

#### Manual deployment (api)

- Install [Serverless](https://www.serverless.com/)
- Change directory `cd kahvilat-api`
- Deploy `./deploy.sh <env>`

#### Manual deployment (ui)

- Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- Change directory `cd kahvilat-ui`
- Build `./build.sh <env>`
- Deploy `./deploy.sh <env>`

#### Automated deployment

- Create a symmetric private key for git-crypt `git-crypt export-key ./crypt.key`
- Convert the key to base64 `base64 ./crypt.key` and use it as value for `GIT_CRYPT_KEY`
- Add your project to CircleCI.
- Add the following environment variables for the project:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
GIT_CRYPT_KEY
```

- Push a new commit to trigger a new deployment, `master` branch deploys to dev environment, and `production` deploys to prod environment.
