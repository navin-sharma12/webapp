#!/bin/sh

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install systemd
sudo apt install unzip
sudo apt install nodejs npm -y
sudo wget https://amazoncloudwatch-agent.s3.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
sudo cp /home/admin/webapp.service /etc/systemd/system/
sudo mv /home/admin/webapp.zip /opt/csye6225/webapp.zip
sudo unzip -o /opt/csye6225/webapp.zip -d /opt/csye6225/
sudo cp /home/admin/cloudwatch-config.json /opt/csye6225/webapp/cloudwatch-config.json
sudo cp /opt/csye6225/webapp/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
sudo chown -R csye6225 /opt/csye6225
sudo chgrp -R csye6225 /opt/csye6225
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/csye6225/webapp/cloudwatch-config.json
cd /opt/csye6225/webapp
sudo npm i
sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service
sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent