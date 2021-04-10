provider "aws" {
  version    = "~> 2.70"
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
  region     = "${var.aws_region}"
}

terraform {
  backend "s3" {
    bucket = "kahvilat-app-infrastructure"
    key    = "kahvilat-app.tfstate"
    region = "eu-west-1"
  }
}

module "frontend" {
  source = "./modules/frontend"

  app_subdomain_name  = "${var.app_subdomain_name}"
  acm_certificate_arn = "${var.frontend_certificate_arn}"
  route53_zone_id     = "${var.frontend_zone_id}"
}
