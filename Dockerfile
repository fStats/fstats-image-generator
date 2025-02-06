FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y \
    python3 make g++ libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json /app/
RUN npm install

COPY . /app

RUN npm run build

EXPOSE 1542

CMD ["node", "./dist/index.js"]
