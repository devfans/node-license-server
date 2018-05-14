FROM node:alpine

# Install deps
COPY package.json package.json
RUN npm install --production

COPY src src
COPY config.js config.js
COPY index.js index.js
COPY private.pem private.pem
COPY public.pem public.pem

# For prod
CMD node index.js
