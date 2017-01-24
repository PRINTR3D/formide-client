# @Copyright: Copyright (c) 2016, All rights reserved, http://printr.nl

#!/usr/bin/env bash

{ # this ensures the entire script is downloaded #

NODE_VERSION="v4.7.0"

# STEP 0: UPDATE APT-GET AND INSTALL MONGODB
sudo apt-get update -y
sudo apt-get install -y build-essential git python

# STEP 1: INSTALL NVM
echo "Installing nvm..."
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash

# STEP 2: CHECK IF NVM IS USING CORRECTION VERSION
source ~/.profile
source ~/.nvm/nvm.sh
echo "Installing needed Node.js version ($NODE_VERSION)..."
nvm install ${NODE_VERSION}
nvm use --delete-prefix ${NODE_VERSION}

# STEP 3: INSTALL NODE-PRE-GYP TO COMPILE NATIVE MODULES
npm install -g node-pre-gyp
source ~/.profile

# STEP 4: INSTALL FORMIDE CLIENT AS GLOBAL NPM PACKAGE
npm install -g formide-client
source ~/.profile

exit 0

} # this ensures the entire script is downloaded #