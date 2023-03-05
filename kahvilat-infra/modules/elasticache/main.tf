resource "aws_elasticache_subnet_group" "main" {
  name       = "kahvilat-app-${terraform.workspace}-redis-subnet-group"
  subnet_ids = [var.subnet_id]
}

resource "aws_elasticache_cluster" "main" {
  cluster_id           = "kahvilat-app-${terraform.workspace}-redis-cluster"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  security_group_ids   = [var.security_group_id]
  subnet_group_name    = aws_elasticache_subnet_group.main.name

  tags = {
    Name = "kahvilat-app-${terraform.workspace}-redis-cluster"
  }
}
