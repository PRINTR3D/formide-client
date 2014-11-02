printspot
=================

Printspot is the internal name for the node.js part of FormideOS. This includes the communication between the online socketserver, the qclient, the eqserver (slicing) and all the different interfaced for manufacturers.


## Install
To install this server:

- Download a zipped version of the repository (see 'version')
- Make sure you have sqlite3, node.js npm and a daemon service installed
- Run node printspot-core/index.js
- Run node printspot-interface/SELECTED_INTERFACE/index.js
- Go to your browser (localhost:1336 for dev, localhost:80 for production)

To keep the apps running, it is suggested to use a node.js daemon tool like supervisor or forever. A start and stop script will be published soon!

## Channels
### General
* handshake
* typeof
* auth

### Dashboard
* dashboard_push_printer_gcode
* dashboard_push_printer_home
* dashboard_push_printer_jog
* dashboard_push_printer_start
* dashboard_push_printer_pause
* dashboard_push_printer_resume
* dashboard_push_printer_cancel
* dashboard_push_printer_file
* dashboard_push_printer_temp_ext
* dashboard_push_printer_temp_bed
* dashboard_push_printer_lcd_message
* dashboard_push_printer_extrude
* dashboard_push_printer_retract
* dashboard_push_printer_fan
* dashboard_push_printer_reconnect
* dashboard_push_printer_autolevel
* dashboard_push_printer_door_open
* dashboard_push_printer_door_close
* dashboard_push_printer_printjob
* dashboard_push_software_version

### Client
* client_push_printer_connect
* client_push_printer_disconnect
* client_push_printer_finished
* client_push_printer_status
* client_push_printer_error
* client_push_software_version