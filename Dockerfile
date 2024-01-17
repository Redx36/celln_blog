FROM node:14-alpine as build

WORKDIR /celln-blog-api
COPY package*.json ./
RUN npm install
COPY . .
COPY .env.sample .env
EXPOSE 8080
CMD npm start