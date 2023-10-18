version                                            = " >= 1.2.0"
source                                             = "github.com/hashicorp/amazon"
aws_region                                         = "us-east-1"
ssh_username                                       = "admin"
ami_users                                          = ["412145925921", "706231857636"]
source_ami                                         = "ami-06db4d78cb1d3bbf9"
ami_name                                           = "csye6225_iac_and_webapp_ami"
ami_description                                    = "AMI for CSYE6225"
instance_type                                      = "t2.micro"
launch_block_device_mappings_device_name           = "/dev/xvda"
launch_block_device_mappings_volume_size           = 8
launch_block_device_mappings_volume_type           = "gp2"
launch_block_device_mappings_delete_on_termination = true
build_sources                                      = "source.amazon-ebs.webapp"
provisioner_csv_source                             = "./users.csv"
provisioner_csv_destination                        = "/home/admin/users.csv"
provisioner_webapp_source                          = "./webapp.zip"
provisioner_webapp_destination                     = "/home/admin/webapp.zip"
script                                             = "./setup.sh"