#!/bin/sh

sleep 30

mkdir opt
sudo apt install unzip
sudo apt install nodejs npm -y
sudo apt install mariadb-server -y
sudo mysql -e "SET PASSWORD FOR root@localhost = PASSWORD('15672N@vin');FLUSH PRIVILEGES;"
printf '15672N@vin\n n\n n\n n\n n\n n\n y\n' | sudo mysql_secure_installation
sudo mysql -e "GRANT ALL PRIVILEGES ON healthCheck.* TO 'root'@'localhost' IDENTIFIED BY '15672N@vin';"
mysql -u root -p15672N@vin -Bse "CREATE DATABASE cloud;"
mysql -u root -p15672N@vin -Bse "SHOW DATABASES;"
cd /root/opt/
unzip -o webapp.zip
cd webapp
npm i
npm start