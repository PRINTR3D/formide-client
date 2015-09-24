#!/bin/bash

file=/etc/hostapd/hostapd.conf

cat > $file << EOL
interface=wlan0

driver=nl80211

ssid=TheElement

channel=6

hw_mode=g

ieee80211d=1

country_code=NL
EOL

file2=/etc/network/interfaces

cat > $file2 << EOL
# loopback network interface
auto lo
iface lo inet loopback

# wireless network interface
iface wlan0 inet manual
hostapd /etc/hostapd/hostapd.conf
address 192.168.1.100
netmask 255.255.255.0
broadcast 192.168.1.255
gateway 192.168.1.1
EOL