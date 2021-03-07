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

Backend
- TypeScript, ESLint, Prettier
- Serverless framework
- Docker (for local development only)
- Jest with `ts-jest` as a testing solution

Frontend
- React, ESLint, Prettier
- `apollo-client` as a REST client for its reactive capabilities
- `material-ui` as an UI framework
- `prop-types` for runtime type-checking for React props
- `react-fontawesome` for icons
- `react-hook-form` as form library
- `react-router-dom` for routing
- `styled-components` for CSS-in-JS

## Local development

Clone the repo

```
git clone https://github.com/jukkhop/kahvilat-app.git
cd kahvilat-app
```

#### Backend

- Install [Node](https://nodejs.org/en/), [Docker](https://www.docker.com/get-started) and [Serverless](https://github.com/serverless/serverless#quick-start)
- Change directory `cd backend`
- Up the cache `docker-compose up -d`
- Install deps `npm install`
- Run `npm run start`
- Run `curl http://localhost:3001/local/places` to verify that the API works as expected

#### Frontend

- Change directory `cd frontend`
- Install deps `npm install`
- Run `npm run start`

Your browser should automatically open at http://localhost:3000/

## Cloud deployment

#### Manual deployment (infrastructure)

- Install [Terraform](https://www.terraform.io/)
- Change directory `cd infrastructure`

- Set environment variables for AWS

```
export AWS_ACCESS_KEY_ID=some_access_key_id
export AWS_SECRET_ACCESS_KEY=some_secret_access_key
export AWS_DEFAULT_REGION=some_region
```

- Adjust domain names and certificate ARNs in `main.tf` to suit your setup
- Initialize terraform `terraform init`
- Create a plan `terraform plan`
- If the plan looks okay, apply it `terraform apply`

#### Manual deployment (backend)

- Change directory `cd backend`
- Deploy to `env` environment:

```
serverless deploy \
  --frontend-url <frontend-url> \
  --google-api-key <google-api-key> \
  --region $AWS_DEFAULT_REGION \
  --stage <env>
```

Notes:

- Get `frontend-url` by first deploying the infrastructure via Terraform.
- Get `google-api-key` from Google Cloud Console.
- The first deployment creates the Redis instance, which will give you host and port to the instance. For consequent manual deployments, you have to pass ` --redis-host` and `--redis-port` as arguments as well.

#### Manual deployment (frontend)

- Install s3deploy `brew install bep/tap/s3deploy`
- Change directory `cd frontend`
- Copy config file `cp .env.<env> .env` and adjust as needed
- Build `yarn build`

```
s3deploy \
  -source=build/ \
  -region=$AWS_DEFAULT_REGION \
  -key=$AWS_ACCESS_KEY_ID \
  -secret=$AWS_SECRET_ACCESS_KEY \
  -distribution-id=<cloudfront-distribution-id> \
  -bucket=<s3-bucket-name>
```

Get `cloudfront-distribution-id` and `s3-bucket-name` by first deploying the infrastructure via Terraform.

#### Automated deployment

- Add your project to CircleCI.
- Add the following environment variables for the project (run manual deployments first to get some of these)

```
AWS_ACCESS_KEY_ID                   # recommended to use a separate IAM user for CircleCI
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION

DEV_AWS_CLOUDFRONT_DISTRIBUTION_ID  # get this by deploying the infrastructure
DEV_AWS_S3_BUCKET_NAME              # get this by deploying the infrastructure
DEV_BACKEND_GOOGLE_API_KEY          # get this from Google Cloud
DEV_FRONTEND_GOOGLE_API_KEY         # get this from Google Cloud
DEV_FRONTEND_URL                    # get this by deploying the infrastructure
DEV_REDIS_HOST                      # get this by deploying the backend
DEV_REDIS_PORT                      # get this by deploying the backend

PRD_AWS_CLOUDFRONT_DISTRIBUTION_ID  # get this by deploying the infrastructure
PRD_AWS_S3_BUCKET_NAME              # get this by deploying the infrastructure
PRD_BACKEND_GOOGLE_API_KEY          # get this from Google Cloud
PRD_FRONTEND_GOOGLE_API_KEY         # get this from Google Cloud
PRD_FRONTEND_URL                    # get this by deploying the infrastructure
PRD_REDIS_HOST                      # get this by deploying the backend
PRD_REDIS_PORT                      # get this by deploying the backend
```

- Push a new commit to trigger a new deployment, `master` branch deploys to dev environment, and `production` deploys to prd environment.
