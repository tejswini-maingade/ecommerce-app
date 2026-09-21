FROM node:24-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --global npm@latest \
    && npm cache clean --force

RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
