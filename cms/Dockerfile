FROM node:16-alpine

RUN apk add --no-cache openssl

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

ENV NODE_ENV=production

WORKDIR /cms

COPY . /cms

RUN npm install
RUN NODE_ENV=production npm run build

EXPOSE 1337

CMD [ "dockerize", "-wait", "tcp://db:5432", "npm", "run", "start" ]
