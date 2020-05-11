<p align="center">
  <img src="https://raw.githubusercontent.com/jukkhop/kahvilat-app/master/frontend/public/logo192.png" />
  <h3 align="center">Discover nearby cafeterias</h3>
  <h4 align="center">https://kahvilat.app - under construction</h4>
</p>

## Local setup

Clone the repo

```
git clone https://github.com/jukkhop/kahvilat-app.git
cd kahvilat-app
```

#### Backend

- Install [Node](https://nodejs.org/en/), [Docker](https://www.docker.com/get-started) and [Serverless](https://github.com/serverless/serverless#quick-start)
- Change directory `cd backend`
- Up the database `docker-compose up -d`
- Install deps `npm install`
- Run `npm run start`
- Run `curl http://localhost:3001/local/places` to verify that the API works as expected

#### Frontend

- Change directory `cd frontend`
- Install deps `npm install`
- Run `npm run start`

Your browser should automatically open at http://localhost:3000/

## Cloud setup

#### Infrastructure

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

#### Manual deployment

- Change directory `cd backend`
- Deploy to dev environment

```
serverless deploy \
  --stage dev \
  --frontend-url some_url \
  --pg-database some_db \
  --pg-user some_user \
  --pg-password some_password
```

- The first deployment creates the RDS instance, which will give you host and port for the database. For consequent manual deployments, you have to pass `--pg-host` and `--pg-port` for the deploy command.

#### Automatic deployment

- Add your project to CircleCI.
- Add the following environment variables for the project (run manual deployment once to get some of these)

```
AWS_ACCESS_KEY_ID                   # recommend to use separate AWS credentials for CircleCI
AWS_DEFAULT_REGION
AWS_SECRET_ACCESS_KEY               # recommend to use separate AWS credentials for CircleCI

DEV_AWS_CLOUDFRONT_DISTRIBUTION_ID  # you get this after terraform setup
DEV_AWS_S3_BUCKET_NAME              # you get this after terraform setup
DEV_FRONTEND_URL                    # you get this after terraform setup
DEV_POSTGRES_DB
DEV_POSTGRES_HOST                   # you get this after serverless deploy
DEV_POSTGRES_PASSWORD
DEV_POSTGRES_PORT                   # you get this after serverless deploy
DEV_POSTGRES_USER

PRD_AWS_CLOUDFRONT_DISTRIBUTION_ID  # you get this after terraform setup
PRD_AWS_S3_BUCKET_NAME              # you get this after terraform setup
PRD_FRONTEND_URL                    # you get this after terraform setup
PRD_POSTGRES_DB
PRD_POSTGRES_HOST                   # you get this after serverless deploy
PRD_POSTGRES_PASSWORD
PRD_POSTGRES_PORT                   # you get this after serverless deploy
PRD_POSTGRES_USER
```

- Push a new commit to trigger a new deployment, `master` branch deploys to dev environment, and `production` deploys to prd environment.
