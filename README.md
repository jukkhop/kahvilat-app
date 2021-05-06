<p align="center">
  <img src="https://raw.githubusercontent.com/jukkhop/kahvilat-app/master/frontend/public/logo192.png" />
  <h3 align="center">Discover nearby cafeterias</h3>
  <h4 align="center">https://kahvilat.app</h4>
</p>

## Tools and libraries used

Miscellaneous

- AWS as cloud provider (API Gateway, CloudFront, ElastiCache, Lambda, Route53, S3, VPC)
- Terraform for infrastructure-as-code
- CircleCI for CI/CD automation
- [git-crypt](https://github.com/AGWA/git-crypt) for encryption

Backend

- Node, TypeScript, ESLint, Prettier
- Redis as a cache
- Serverless framework
- Docker (for local development only)
- Jest with `ts-jest` as a testing solution

Frontend

- React, TypeScript, ESLint, Prettier
- `apollo-client` as a REST client for its reactive capabilities
- `material-ui` as an UI framework
- `react-fontawesome` for icons
- `react-hook-form` as form library
- `react-router-dom` for routing
- `styled-components` for CSS-in-JS

## Local development

#### Backend

- Install [Node](https://nodejs.org/en/), [Docker](https://www.docker.com/get-started) and [Serverless](https://github.com/serverless/serverless#quick-start)
- Change directory `cd backend`
- Up the cache `docker-compose up -d`
- Install deps `yarn install`
- Run `yarn start`
- Run `curl http://localhost:3001/local/places` to verify that the API works as expected

#### Frontend

- Change directory `cd frontend`
- Install deps `yarn install`
- Create env file `cp .env.template .env` and adjust variables as needed
- Run `yarn start`
- Your browser should automatically open at http://localhost:3000/

## Cloud deployment

Environment-specific variables and secrets are kept in the `environment` folder. Secrets are encrypted, make sure to run `git-crypt unlock` to decrypt them.

#### Manual deployment (infrastructure)

- Install [Terraform](https://www.terraform.io/)
- Change directory `cd infrastructure`
- Deploy `./deploy.sh <env>`

#### Manual deployment (backend)

- Install [Serverless](https://www.serverless.com/)
- Change directory `cd backend`
- Deploy `./deploy.sh <env>`

#### Manual deployment (frontend)

- Install [s3deploy](https://github.com/bep/s3deploy)
- Change directory `cd frontend`
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

- Push a new commit to trigger a new deployment, `master` branch deploys to dev environment, and `production` deploys to prd environment.
