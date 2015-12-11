# Set the base image to Node
FROM    node:4.2
RUN npm install npm -g
VOLUME /root/formide

ENV NODE_ENV production

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir -p /srv/formide-client && cp -a /tmp/node_modules /srv/formide-client

# Define working directory and add root app dir to it
WORKDIR /srv/formide-client
ADD . /srv/formide-client

# Expose ports
# API
EXPOSE 1337
# UI
EXPOSE 8080
# Sockets
EXPOSE 3001

# Run app using nodemon
CMD node scripts/post-install.js && node bootstrap.js
