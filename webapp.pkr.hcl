packer {
  required_plugins {
    amazon = {
      version = " >= 1.2.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = null
}

variable "ssh_username" {
  type    = string
  default = null
}

variable "source_ami" {
  type    = string
  default = null
}

variable "ami_description" {
  type    = string
  default = null
}

variable "instance_type" {
  type    = string
  default = null
}

variable "launch_block_device_mappings_volume_size" {
  type    = number
  default = null
}

variable "launch_block_device_mappings_volume_type" {
  type    = string
  default = null
}

variable "launch_block_device_mappings_delete_on_termination" {
  type    = bool
  default = null
}

variable "build_sources" {
  type    = string
  default = null
}

variable "provisioner_csv_source" {
  type    = string
  default = null
}

variable "provisioner_csv_destination" {
  type    = string
  default = null
}

variable "provisioner_webapp_source" {
  type    = string
  default = null
}

variable "provisioner_webapp_destination" {
  type    = string
  default = null
}

variable "script" {
  type    = string
  default = null
}

variable "ami_name" {
  type    = string
  default = null
}

variable "launch_block_device_mappings_device_name" {
  type    = string
  default = null
}

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

variable "ami_users" {
  type    = list(string)
  default = null
}

variable "ami_regions" {
  type    = list(string)
  default = null
}

source "amazon-ebs" "webapp" {
  source_ami = "${var.source_ami}"

  ami_name        = "${var.ami_name}"
  ami_description = "${var.ami_description}"
  region          = "${var.aws_region}"
  ami_users       = "${var.ami_users}"
  ami_regions     = "${var.ami_regions}"

  instance_type = "${var.instance_type}"
  ssh_username  = "${var.ssh_username}"

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
