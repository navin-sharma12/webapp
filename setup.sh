#!/bin/sh

echo "PASSWORD=${PD}"
echo "DATABASE=${DATABASE}"
echo "USER=${USER}"

sudo apt-get u{PD}ate
sudo apt-get upgrade -y
sudo apt install unzip
sudo apt install nodejs npm -y
sudo apt install mariadb-server -y
sudo mysql -e "SET PASSWORD FOR root@localhost = PASSWORD('${PD}');FLUSH PRIVILEGES;"
printf `${PD}\n n\n n\n n\n n\n n\n y\n` | sudo mysql_secure_installation
sudo mysql -e "GRANT ALL PRIVILEGES ON ${DATABASE}.* TO 'root'@'localhost' IDENTIFIED BY '${PD}';"
mysql -u root -p${PD} -Bse "CREATE DATABASE ${DATABASE};"
mysql -u root -p${PD} -Bse "SHOW DATABASES;"
sudo mkdir opt
sudo mv /home/admin/webapp.zip /home/admin/opt/webapp.zip
sudo mv /home/admin/users.csv /home/admin/opt/webapp/users.csv
cd opt
sudo unzip -o webapp.zip
cd webapp
sudo npm i
sudo npm run test
# sudo npm start