packer {
  required_plugins {
    amazon = {
      version = " >= 1.2.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

# variable "aws_region" {
#   type    = string
#   default = "us-east-1"
# }

# variable "ssh_username" {
#   type    = string
#   default = "admin"
# }

variable "USER" {
  type    = string
  default = "${env("USER")}"
}

variable "DATABASE" {
  type    = string
  default = "${env("DATABASE")}"
}

variable "PD" {
  type    = string
  default = "${env("PD")}"
}

# variable "aws_account_ids" {
#   type        = list(string)
#   default     = ["412145925921", "706231857636"]
# }

source "amazon-ebs" "webapp" {
  # source_ami_filter {
  #   most_recent = true

  #   filters = {
  #     name                = "debian-12-*"
  #     architecture        = "x86_64"
  #     root-device-name    = "/dev/xvda"
  #     root-device-type    = "ebs"
  #     virtualization-type = "hvm"
  #   }
  #   owners = ["amazon"]
  # }

  source_ami = "${source_ami}"

  ami_name        = "${ami_name}"
  ami_description = "${ami_description}"
  region          = "${region}"
  ami_users = "${ami_users}"

  # aws_polling {
  #   delay_seconds = 120
  #   max_attempts  = 50
  # }

  instance_type = "${instance_type}"
  ssh_username  = "${ssh_username}"

  launch_block_device_mappings {
    device_name           = "${var.launch_block_device_mappings_device_name}"
    volume_size           = "${var.launch_block_device_mappings_volume_size}"
    volume_type           = "${var.launch_block_device_mappings_volume_type}"
    delete_on_termination = "${var.launch_block_device_mappings_delete_on_termination}"
  }
}


build {
  sources = [
    "source.amazon-ebs.webapp"
  ]

  provisioner "file" {
    source      = "${var.provisioner_csv_source}"
    destination = "${var.provisioner_csv_destination}"
  }

  provisioner "file" {
    source      = "${var.provisioner_webapp_source}"
    destination = "${var.provisioner_webapp_destination}"
  }

  provisioner "shell" {
    script = "${var.script}"
    environment_vars = [
      "PD=${var.PD}",
      "DATABASE=${var.DATABASE}",
      "USER=${var.USER}"
    ]
  }
}
