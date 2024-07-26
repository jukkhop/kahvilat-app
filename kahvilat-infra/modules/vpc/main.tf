resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "kahvilat-app-${terraform.workspace}-vpc"
  }
}

resource "aws_subnet" "private" {
  availability_zone = "${var.aws_region}a"
  cidr_block        = "10.0.1.0/24"
  vpc_id            = aws_vpc.main.id

  tags = {
    Name = "kahvilat-app-${terraform.workspace}-subnet-private"
  }
}

resource "aws_subnet" "public" {
  availability_zone = "${var.aws_region}a"
  cidr_block        = "10.0.2.0/24"
  vpc_id            = aws_vpc.main.id

  tags = {
    Name = "kahvilat-app-${terraform.workspace}-subnet-public"
  }
}

resource "aws_eip" "nat" {
  vpc = true

  tags = {
    Name = "kahvilat-app-${terraform.workspace}-eip"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "kahvilat-app-${terraform.workspace}-internet-gw"
  }
}

resource "aws_nat_gateway" "gw" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public.id

  tags = {
    Name = "kahvilat-app-${terraform.workspace}-nat-gw"
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.gw.id
  }

  tags = {
    Name = "kahvilat-app-${terraform.workspace}-route-table-private"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "kahvilat-app-${terraform.workspace}-route-table-public"
  }
}

resource "aws_route_table_association" "private" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}
