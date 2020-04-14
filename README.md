Under construction &nbsp;🔧

## Setup

Clone the repo

```
git clone https://github.com/jukkhop/kahvilat-app.git
cd kahvilat-app
```

#### Backend

Install [Node](https://nodejs.org/en/) and [Serverless](https://github.com/serverless/serverless#quick-start)

Change directory

```
cd backend
```

Install deps

```
npm install
```

Run

```
npm run api
```

#### Frontend

Change directory

```
cd frontend
```

Install deps

```
npm install
```

Run

```
npm run start
```

Your browser should automatically open http://localhost:3000/

#### Infrastructure

Install [Terraform](https://www.terraform.io/)

Change directory

```
cd infrastructure
```

Set environment variables for AWS

```
export AWS_ACCESS_KEY_ID=some_access_key_id
export AWS_SECRET_ACCESS_KEY=some_secret_access
export AWS_DEFAULT_REGION=some_region
```

Initialize terraform and create a plan

```
terraform init
terraform plan
```

If the plan looks okay, apply it

```
terraform apply
```

### Deploy

Add your project to CircleCI.

Push a new commit to the `master` branch to trigger a deployment.
