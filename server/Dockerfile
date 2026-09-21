FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev \
    && npm cache clean --force

COPY . .

# npm is only needed while building the image.
# Remove it from the final runtime image so Trivy
# does not scan npm's bundled vulnerable dependencies.
RUN rm -rf /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx

EXPOSE 5000

CMD ["node", "index.js"]
