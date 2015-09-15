#!/bin/bash

file=/etc/network/interfaces
ssid=$1
psk=$2

cat > $file << EOL
# loopback network interface
auto lo
iface lo inet loopback

# wireless network interface
iface wlan0 inet dhcp
wpa-ssid "$ssid"
wpa-psk "$psk"
EOL