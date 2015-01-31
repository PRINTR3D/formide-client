FROM 		nodesource/node:wheezy

ADD 		. /home/formideos/core

WORKDIR 	/home/formideos/core

RUN			npm install

EXPOSE 		1336
EXPOSE 		1337

ENTRYPOINT	[ "npm", "start" ]