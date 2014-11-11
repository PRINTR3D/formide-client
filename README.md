printspot
=================

Printspot is the internal name for the node.js part of FormideOS. This includes the communication between the online socketserver, the qclient, the eqserver (slicing) and all the different interfaces for manufacturers.


## Install
To install this application:

- Download a zipped version of the repository (see 'version')
- Make sure you have sqlite3 and node.js installed

## Start
To start the application:

- Start up the printer driver (Qclient/nectarClient/qclient-simulator)
- Run node start.js --interface=nectar (node start.js --interface=nectar --dev to get console logging)

## Local dashboard

- Go to your browser (http://localhost:1336 during development)

## Online dashboard

- Working version coming soon, all efforts are now on the local dashboard first