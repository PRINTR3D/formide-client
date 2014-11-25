printspot
=================

Printspot is the internal name for the node.js part of FormideOS. This includes the communication between the online socketserver, the qclient, katana (slicing) and all the different interfaces for manufacturers.


## Install
- Create a folder with mkdir /home/printspot
- Go to that folder with cd /home/printspot
- Download a zipped version of the repository (see 'version') and put it in /home/printspot
- Unzip the zip, this should create several folders and files in /home/printspot
- Delete the zip (if you want)

## Important
- Make sure you have sqlite3 and node.js installed and have sqlite3 compiled for your machine
- Run the sqlite3 daemon

## Start
- Start up the printer driver (qclient, nectarClient or qclient-simulator) that hosts a TCP server on port 1338
- Run node start.js --interface=nectar (node start.js --interface=nectar --dev to get console logging)

## Local dashboard
- Go to your browser (http://localhost:1336 during development)