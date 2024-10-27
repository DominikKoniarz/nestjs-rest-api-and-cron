FROM node:20-alpine as base

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

COPY prisma ./prisma

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine as production

WORKDIR /app

COPY --from=base /app/package.json .
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/tsconfig.json .
COPY --from=base /app/tsconfig.build.json .
COPY --from=base /app/prisma ./prisma

EXPOSE 3000

CMD [ "npm", "run", "start" ]