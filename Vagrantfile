# -*- mode: ruby -*-
# vi: set ft=ruby :

$script = <<'SCRIPT'

#!/usr/bin/env bash

STARTTIME=$(date +%s)

echo "Updating packages..."
sudo apt-get update &> /dev/null

echo "Installing Apache..."
sudo apt-get install -y apache2 &> /dev/null

echo "Installing PHP..."
sudo apt-get install -y php5 libapache2-mod-php5 &> /dev/null

echo "Installing MySQL..."
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'
sudo apt-get install -y mysql-server &> /dev/null

echo "Installing PHP extensions..."
sudo apt-get install -y php5-cli php5-curl php5-gd php5-mcrypt php5-json php5-mysql &> /dev/null

echo "Installing cURL..."
sudo apt-get install -y curl &> /dev/null

echo "Installing Git..."
sudo apt-get install -y git &> /dev/null

echo "Installing Node.js..."
sudo apt-get update &> /dev/null
sudo apt-get install -y python-software-properties python g++ make &> /dev/null
sudo add-apt-repository -y ppa:chris-lea/node.js &> /dev/null
sudo apt-get update &> /dev/null
sudo apt-get install -y nodejs &> /dev/null

echo "Installing Grunt CLI..."
sudo npm install -g grunt-cli &> /dev/null

echo "Installing oh-my-zsh..."
sudo apt-get install -y zsh &> /dev/null
sudo su vagrant -c "curl --silent -L https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh | sh" &> /dev/null
sudo chsh -s /bin/zsh vagrant &> /dev/null

echo "Installing Ruby..."
sudo apt-get install -y ruby &> /dev/null
sudo apt-get install -y rubygems &> /dev/null

echo "Installing SASS..."
sudo gem install sass &> /dev/null

echo "Installing Composer..."
curl -sS https://getcomposer.org/installer | php &> /dev/null
sudo mv composer.phar /usr/local/bin/composer

echo "Enabling mod_rewrite..."
sudo a2enmod rewrite &> /dev/null

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

echo "Enabling error reporting..."
sed -i "s/error_reporting = .*/error_reporting = E_ALL/" /etc/php5/apache2/php.ini
sed -i "s/display_errors = .*/display_errors = On/" /etc/php5/apache2/php.ini
sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

echo "Restarting Apache..."
sudo service apache2 restart &> /dev/null

echo "Setting document root..."
sudo rm -rf /var/www
sudo ln -fs /vagrant/public /var/www

echo "Disabling SSH timeout..."
echo "ClientAliveInterval 30" | sudo tee -a /etc/ssh/sshd_config &> /dev/null
echo "ClientAliveCountMax 90" | sudo tee -a /etc/ssh/sshd_config &> /dev/null
sudo service ssh restart &> /dev/null

echo "Removing login banner..."
sudo rm -rf /etc/motd

cd /vagrant

echo "Running Composer install..."
composer install &> /dev/null

echo "Running npm install..."
sudo npm install &> /dev/null

echo "Creating and migrating database..."
echo 'CREATE DATABASE IF NOT EXISTS `database`' | mysql -uroot -proot
php artisan migrate &> /dev/null
php artisan db:seed &> /dev/null

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