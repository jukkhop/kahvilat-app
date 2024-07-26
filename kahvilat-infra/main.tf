terraform {
  backend "s3" {
    bucket = "kahvilat-app-infrastructure"
    key    = "kahvilat-app.tfstate"
    region = "eu-west-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }

  required_version = ">= 0.13, < 0.14"
}

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.aws_region
}

module "ui" {
  source = "./modules/ui"

  acm_certificate_arn = var.ui_certificate_arn
  domain_name         = var.ui_domain_name
  route53_zone_id     = var.ui_zone_id
}

module "vpc" {
  source = "./modules/vpc"

  aws_region = var.aws_region
}

module "security_groups" {
  source = "./modules/security-groups"

  vpc_id = module.vpc.vpc_id
}

module "elasticache" {
  source = "./modules/elasticache"

  cluster_id        = var.redis_cluster_id
  security_group_id = module.security_groups.redis_security_group_id
  subnet_id         = module.vpc.private_subnet_id
}
