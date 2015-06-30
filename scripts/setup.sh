#!/bin/bash

echo "Installing required some root permissions, please run as root if you didn't already."

if which git >/dev/null; then
    echo "Git already installed"
else
	echo "Git not installed, installing now..."
	sudo apt-get install -y git
	echo "Done!"
fi

if which node >/dev/null; then
    echo "Nodejs already installed"
else
	echo "Nodejs not installed, installing now..."
	curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
	sudo apt-get install -y nodejs
	echo "Done!"
fi

echo "Creating root direcotry..."
mkdir /home/pi/formideos
cd /home/pi/formideos
echo "Done!"

echo "Cloning formideOS-client..."
git clone https://github.com/PRINTR3D/formideOS-client.git
echo "Done!"

echo "Creating support directories..."
mkdir uploads
mkdir uploads/modelfiles
mkdir uploads/gcode
mkdir uploads/tmp
mkdir storage
mkdir storage/database
echo "Done!"

echo "Creating support files..."
touch storage/FormideOS.log
echo "Done!"

echo "Installing dependencies"
cd formideOS-client
npm install
echo "Done!"

echo "Copying service scripts"
cp scripts/formideos /etc/init.d/formideos
chmod 755 /etc/init.d/formideos
chown root:root /etc/init.d/formideos
echo "Done!"

echo "Adding service to boot sequence"
update-rc.d formideos start
echo "Done!"

echo "Running FORMIDEOS for the first time..."
echo "Visit http://setup.formide.com to continue the setup"
node bootstrap.js --setup