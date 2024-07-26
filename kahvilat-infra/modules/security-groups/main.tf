resource "aws_security_group" "lambda" {
  name        = "kahvilat-app-${terraform.workspace}-lambda-sg"
  description = "Security group for Lambda functions"
  vpc_id      = var.vpc_id

  tags = {
    Name = "kahvilat-app-${terraform.workspace}-lambda-sg"
  }
}

resource "aws_security_group" "redis" {
  name        = "kahvilat-app-${terraform.workspace}-redis-sg"
  description = "Security group for Redis cluster"
  vpc_id      = var.vpc_id

  tags = {
    Name = "kahvilat-app-${terraform.workspace}-redis-sg"
  }
}

resource "aws_security_group_rule" "lambda_internet_rule" {
  depends_on = [aws_security_group.lambda]

  description       = "Allow outgoing HTTPS connections to the Internet"
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  security_group_id = aws_security_group.lambda.id
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "lambda_redis_rule" {
  depends_on = [
    aws_security_group.lambda,
    aws_security_group.redis
  ]

  description              = "Allow outgoing Redis connections to the Redis cluster"
  type                     = "egress"
  from_port                = 6379
  to_port                  = 6379
  protocol                 = "tcp"
  security_group_id        = aws_security_group.lambda.id
  source_security_group_id = aws_security_group.redis.id
}

resource "aws_security_group_rule" "redis_lambda_rule" {
  depends_on = [
    aws_security_group.redis,
    aws_security_group.lambda
  ]

  description              = "Allow incoming Redis connections from Lambda functions"
  type                     = "ingress"
  from_port                = 6379
  to_port                  = 6379
  protocol                 = "tcp"
  security_group_id        = aws_security_group.redis.id
  source_security_group_id = aws_security_group.lambda.id
}
