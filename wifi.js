var iwconfig = require('wireless-tools/iwconfig');
 
iwconfig.status(function(err, status) {
  console.log(status);
});