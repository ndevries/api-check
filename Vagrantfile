# -*- mode: ruby -*-
# vi: set ft=ruby :

$script = <<'SCRIPT'

#!/usr/bin/env bash

STARTTIME=$(date +%s)

echo "Updating packages..."
sudo apt-get update &> /dev/null

echo "Installing Apache..."
sudo apt-get install -y apache2 &> /dev/null

echo "Configuring virtual host..."
VHOST=$(cat <<EOF
<VirtualHost *:80>
    DocumentRoot /var/www
    ServerName localhost
    <Directory /var/www>
    AllowOverride All
    </Directory>
</VirtualHost>
EOF
)
sudo echo "${VHOST}" > /etc/apache2/sites-enabled/000-default

echo "Restarting Apache..."
sudo service apache2 restart &> /dev/null

echo "Setting document root..."
sudo rm -rf /var/www
sudo ln -fs /vagrant /var/www

echo "Disabling SSH timeout..."
echo "ClientAliveInterval 30" | sudo tee -a /etc/ssh/sshd_config &> /dev/null
echo "ClientAliveCountMax 90" | sudo tee -a /etc/ssh/sshd_config &> /dev/null
sudo service ssh restart &> /dev/null

echo "Removing login banner..."
sudo rm -rf /etc/motd

ENDTIME=$(date +%s)

echo "Provisioning complete in $(($ENDTIME - $STARTTIME)) seconds..."

SCRIPT

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "precise32"

  config.vm.box_url = "http://files.vagrantup.com/precise32.box"

  config.vm.network :forwarded_port, guest: 80, host: 8888

  config.vm.synced_folder "./", "/vagrant", :mount_options => ["dmode=777","fmode=666"]

  config.vm.provider :virtualbox do |vb|
    vb.customize ["modifyvm", :id, "--memory", "512"]
  end

  config.vm.provision "shell", inline: $script

end