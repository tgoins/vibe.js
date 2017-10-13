#!/usr/bin/env bash

function notify {
    printf "\n--------------------------------------------------------\n"
    printf "\t$1"
    printf "\n--------------------------------------------------------\n"
}

notify "Begin Provisioning"

sudo apt-get -y update
sudo apt-get -y upgrade

if ! which node &> /dev/null; then
  notify "Installing NodeJS and NPM"
  #Package prerequisites for node.js
  sudo apt-get -y install python-software-properties python g++ make build-essential git curl wget vim nfs-common portmap htop ca-certificates
  sudo apt-get -y update
  curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
  sudo add-apt-repository -y -r ppa:chris-lea/node.js
  sudo rm -f /etc/apt/sources.list.d/chris-lea-node_js-*.list
  curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if ! which mongo &> /dev/null; then
  notify "Installing MongoDB"
  #Fetch GPG key
  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927

  #Add 10 gen repository
  echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

  sudo apt-get update

  #Install latest mongodb
  sudo apt-get install -y mongodb-org

  notify "Configuring MongoDB"

  FILE="/etc/systemd/system/mongodb.service"

  cat <<EOF >$FILE

  [Unit]
  Description=High-performance, schema-free document-oriented database
  After=network.target

  [Service]
  User=mongodb
  ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf

  [Install]
  WantedBy=multi-user.target

EOF

  #Run mongo daemon
  sudo systemctl start mongodb
  #Automatically start MongoDB when the system starts
  sudo systemctl enable mongodb
fi

# Install dependencies in package.json
notify "Installing bot dependencies"
cd /vagrant/
npm install

notify "Provisioning Complete!"
