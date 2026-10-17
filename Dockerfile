FROM node:22.14.0-alpine

WORKDIR /profile

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY README.md .nvmrc Makefile ./
COPY scripts ./scripts

CMD ["npm", "test"]
