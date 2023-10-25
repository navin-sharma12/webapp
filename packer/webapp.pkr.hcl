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
  default = "us-east-1"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ami_description" {
  type    = string
  default = "AMI for CSYE6225"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "launch_block_device_mappings_volume_size" {
  type    = number
  default = 8
}

variable "launch_block_device_mappings_volume_type" {
  type    = string
  default = "gp2"
}

variable "launch_block_device_mappings_delete_on_termination" {
  type    = bool
  default = true
}

variable "provisioner_csv_source" {
  type    = string
  default = "./users.csv"
}

variable "provisioner_csv_destination" {
  type    = string
  default = "/home/admin/users.csv"
}

variable "provisioner_webapp_source" {
  type    = string
  default = "./webapp.zip"
}

variable "provisioner_webapp_destination" {
  type    = string
  default = "/home/admin/webapp.zip"
}

variable "script" {
  type    = string
  default = "../script/setup.sh"
}

variable "ami_name" {
  type    = string
  default = "csye6225_iac_and_webapp_ami"
}

variable "launch_block_device_mappings_device_name" {
  type    = string
  default = "/dev/xvda"
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
  default = ["412145925921", "706231857636"]
}

variable "ami_regions" {
  type    = list(string)
  default = ["us-east-1"]
}

variable "systemd_source" {
  type    = string
  default = "./webapp.service"
}

variable "systemd_destination" {
  type    = string
  default = "/home/admin/"
}

source "amazon-ebs" "webapp" {
  source_ami = "${var.source_ami}"

  ami_name        = "${var.ami_name}_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
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

  provisioner "file" {
    source      = "${var.systemd_source}"
    destination = "${var.systemd_destination}"
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
