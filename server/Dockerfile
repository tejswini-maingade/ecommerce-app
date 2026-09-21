FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev \
    && npm install --omit=dev --save=false \
       brace-expansion@5.0.9 \
       ip-address@10.3.1 \
       tar@7.5.21 \
    && npm cache clean --force

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
