#!/bin/sh

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install systemd
sudo apt install unzip
sudo apt install nodejs npm -y
sudo mkdir opt
sudo mv /home/admin/webapp.zip /home/admin/opt/webapp.zip
cd opt
sudo unzip -o webapp.zip -d /home/admin/opt/webapp
cd webapp
sudo npm i
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
sudo cp /home/admin/webapp.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service