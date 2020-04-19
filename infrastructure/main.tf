provider "aws" {}

resource "aws_route53_zone" "zone" {
  name = "kahvilat.app"
}

module "frontend-prd" {
  source = "./modules/frontend"

  application_subdomain = "kahvilat.app"
  certificate_arn = "arn:aws:acm:us-east-1:262897496864:certificate/e84be4d8-467a-4df1-9bad-39a6a0b4f68b"
  zone_id = "${aws_route53_zone.zone.zone_id}"
}

module "frontend-dev" {
  source = "./modules/frontend"

  application_subdomain = "dev.kahvilat.app"
  certificate_arn = "arn:aws:acm:us-east-1:262897496864:certificate/03aaf2d8-b160-4f44-a780-600fefc10cfe"
  zone_id = "${aws_route53_zone.zone.zone_id}"
}
