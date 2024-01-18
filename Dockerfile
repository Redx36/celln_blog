FROM node:14

WORKDIR /celln-blog-api
COPY package.json ./
RUN npm install
COPY . .
COPY .env.sample .env
EXPOSE 8080
CMD npm start