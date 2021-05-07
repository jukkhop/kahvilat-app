terraform {
  backend "s3" {
    bucket = "kahvilat-app-infrastructure"
    key    = "kahvilat-app.tfstate"
    region = "eu-west-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 2.70"
    }
  }
}

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.aws_region
}

module "frontend" {
  source = "./modules/frontend"

  app_subdomain_name  = var.app_subdomain_name
  acm_certificate_arn = var.frontend_certificate_arn
  route53_zone_id     = var.frontend_zone_id
}

module "vpc" {
  source = "./modules/vpc"

  aws_region = var.aws_region
}

module "elasticache" {
  source = "./modules/elasticache"

  security_group_id = module.vpc.redis_security_group_id
  subnet_id         = module.vpc.private_subnet_id
}
