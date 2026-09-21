FROM node:24-slim

WORKDIR /app

# Ensure npm contains tar >= 7.5.21
RUN npm install --global npm@latest \
    && npm cache clean --force

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
