FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV development

COPY package.json /app

RUN apk add --no-cache python3 make g++ pixman-dev cairo-dev pango-dev jpeg-dev giflib-dev pkgconf && \
    npm install

COPY . /app

EXPOSE 1540

CMD [ "node", "index.js" ]
