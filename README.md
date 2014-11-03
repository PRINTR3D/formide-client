printspot
=================

Printspot is the internal name for the node.js part of FormideOS. This includes the communication between the online socketserver, the qclient, the eqserver (slicing) and all the different interfaced for manufacturers.


## Install
To install this server:

- Download a zipped version of the repository (see 'version')
- Make sure you have sqlite3, node.js npm and a daemon service installed
- Run node start.js --interface=nectar
- Go to your browser (http://localhost:1336 for develoment)

Additionally, when you want to run in simulated qclient mode or dev mode, add --sim and --dev to the node start.js command.

## Docs
See docs.printr.nl for more detailed information on the websocket protocol.