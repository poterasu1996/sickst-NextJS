FROM node:16

ENV NODE_ENV production

WORKDIR /app

COPY package* ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "run", "start"]
