output "private_subnet_id" {
  value = aws_subnet.private.id
}

output "redis_security_group_id" {
  value = aws_security_group.redis.id
}
