FROM node

ADD . /opt/formideos/client
WORKDIR /opt/formideos/client
RUN npm install

EXPOSE 1337