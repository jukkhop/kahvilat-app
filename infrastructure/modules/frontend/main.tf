resource "aws_s3_bucket" "frontend_s3_bucket" {
  bucket = var.app_subdomain_name
  acl    = "public-read"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AddPerm",
    "Effect": "Allow",
    "Principal": "*",
    "Action": ["s3:GetObject"],
    "Resource": ["arn:aws:s3:::${var.app_subdomain_name}/*"]
  }]
}
POLICY

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_cloudfront_distribution" "frontend_cloudfront_distribution" {
  origin {
    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }

    domain_name = aws_s3_bucket.frontend_s3_bucket.website_endpoint
    origin_id   = var.app_subdomain_name
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    default_ttl            = 86400
    max_ttl                = 31536000
    min_ttl                = 0
    target_origin_id       = var.app_subdomain_name
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  custom_error_response {
    error_caching_min_ttl = 3000
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  aliases = [var.app_subdomain_name]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.acm_certificate_arn
    ssl_support_method  = "sni-only"
  }
}

resource "aws_route53_record" "frontend_record" {
  zone_id = var.route53_zone_id
  name    = var.app_subdomain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend_cloudfront_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.frontend_cloudfront_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
