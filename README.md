<p align="center">
  <img src="https://raw.githubusercontent.com/jukkhop/kahvilat-app/master/frontend/public/logo192.png" />
  <h3 align="center">Discover nearby cafeterias</h3>
  <h4 align="center">https://kahvilat.app - under construction</h4>
</p>

## Setup

Clone the repo

```
git clone https://github.com/jukkhop/kahvilat-app.git
cd kahvilat-app
```

#### Backend

- Install [Node](https://nodejs.org/en/) and [Serverless](https://github.com/serverless/serverless#quick-start)
- Change directory `cd backend`
- Install deps `npm install`
- Run `npm run api`

#### Frontend

- Change directory `cd frontend`
- Install deps `npm install`
- Run `npm run start`

Your browser should automatically open http://localhost:3000/

#### Infrastructure

- Install [Terraform](https://www.terraform.io/)
- Change directory `cd infrastructure`

- Set environment variables for AWS

```
export AWS_ACCESS_KEY_ID=some_access_key_id
export AWS_SECRET_ACCESS_KEY=some_secret_access_key
export AWS_DEFAULT_REGION=some_region
```

- Initialize terraform `terraform init`
- Create a plan `terraform plan`
- If the plan looks okay, apply it `terraform apply`

### Deploy

- Add your project to CircleCI.
- Push a new commit to the `master` branch to trigger a new deployment.
