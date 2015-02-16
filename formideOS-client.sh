### BEGIN INIT INFO
# Provides:             formideOS-client
# Required-Start:
# Required-Stop:
# Default-Start:        2 3 4 5
# Default-Stop:         0 1 6
# Short-Description:    formideOS-client connects printer, slicer, dashboard and cloud
### END INIT INFO

export PATH=$PATH:/opt/node/bin
export NODE_PATH=$NODE_PATH:/opt/node/lib/node_modules
export HOME=/root

case "$1" in
  start)
    /opt/node/bin/forever -p /root/.forever --sourceDir=/home/debian/formideOS/formideOS-client
    ;;
  stop)
    exec /opt/node/bin/forever stopall
    ;;
  *)

  echo "Usage: /etc/init.d/nodeup {start|stop}"
  exit 1
  ;;
esac
exit 0