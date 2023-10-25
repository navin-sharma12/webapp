#!/bin/sh

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install systemd
sudo apt install unzip
sudo apt install nodejs npm -y
sudo mkdir opt
sudo mv /home/admin/webapp.zip /home/admin/opt/webapp.zip
cd opt
sudo unzip -o webapp.zip
cd webapp
sudo npm i
sudo cp /home/admin/webapp.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service