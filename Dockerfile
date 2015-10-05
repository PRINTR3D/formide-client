# Set the base image to Node
FROM    node:0.12

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /srv/formide-client && cp -a /tmp/node_modules /srv/formide-client

# Define working directory and add root app dir to it
WORKDIR /srv/formide-client
ADD . /srv/formide-client

# Expose port
EXPOSE 1337
EXPOSE 8080

# Run app using nodemon
CMD node bootstrap.js