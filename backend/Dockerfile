FROM node:lts-slim

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon

RUN npm install && npm audit fix

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]

