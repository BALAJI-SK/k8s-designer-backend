---
to: <%= outputPath %>/<%= name %>/Dockerfile
force: true
---
FROM alpine:latest

RUN apk add --update nodejs npm

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY . .

ENTRYPOINT ["npm", "start"]