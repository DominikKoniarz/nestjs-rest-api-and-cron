FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

# Won't work bc wrong db url

CMD [ "npm", "run", "start" ]