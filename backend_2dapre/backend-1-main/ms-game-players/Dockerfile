FROM node:20.5.0-alpine as build

WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 8080
CMD ["npm", "run", "start"]