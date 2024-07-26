output "lambda_security_group_id" {
  value = aws_security_group.lambda.id
}

output "redis_security_group_id" {
  value = aws_security_group.redis.id
}
