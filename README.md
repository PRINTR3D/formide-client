printspot
=================

Printspot is the internal name for the node.js part of FormideOS. This includes the communication between the online socketserver, the qclient, katana (slicing) and all the different interfaces for manufacturers.

## Important
- Make sure you have sqlite3 and node.js installed and have sqlite3 compiled for your machine
- Run the sqlite3 daemon

## Install core
- Create a folder with mkdir /home/printspot
- Go to that folder with cd /home/printspot
- Download a zipped version of the repository (see 'version') and put it in /home/printspot
- Unzip the zip, this should create several folders and files in /home/printspot
- Delete the zip (if you want)

## Install interface
- Download an interface app from GitHub or check one out
- Put it a folder in the /home/printspot folder (gitignore should ignore this interface folder)

## Start
- Start up the printer driver (qclient, nectarClient or qclient-simulator) that hosts a TCP server on port 1338
- Run node start.js --interface=printspot-formide-dashboard (port 1336 for interface, 1337 for core)
- Add --dev for debug info
- Add --simulator when no printer driver client is available (port 1338)
- Add --slicer when no slicer is available (port 1339)

## Local dashboard
- Go to your browser (http://localhost:1336 during development)

## Endpoints

#### sliceprofiles
- GET /api/sliceprofiles
- GET /api/sliceprofiles/:id
- PUT /api/sliceprofiles
- POST /api/sliceprofiles/:id
- DELETE /api/sliceprofiles/:id

#### printjobs
- GET /api/printjobs
- GET /api/printjobs/:id
- PUT /api/printjobs
- POST /api/printjobs/:id
- DELETE /api/printjobs/:id

#### materials
- GET /api/materials
- GET /api/materials/:id
- PUT /api/materials
- POST /api/materials/:id
- DELETE /api/materials/:id

#### printers
- GET /api/printers
- GET /api/printers/:id
- PUT /api/printers
- POST /api/printers/:id
- DELETE /api/printers/:id

#### users
- GET /api/users
- GET /api/users/:id
- PUT /api/users
- POST /api/users/:id
- DELETE /api/users/:id

#### modelfiles
- GET /api/modelfiles
- GET /api/modelfiles/:id
- PUT /api/modelfiles
- POST /api/modelfiles/:id
- DELETE /api/modelfiles/:id

#### queue
- GET /api/queue
- GET /api/queue/:id- DELETE /api/queue/:id

#### session
- POST /login
- POST /logout
- GET /session

#### slicing and queue
- POST /slicing
- POST /addtoqueue
