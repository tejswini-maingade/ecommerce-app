FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --global npm@latest \
    && npm cache clean --force

RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
