FROM node:18-alpine

# Create app directory
WORKDIR /app

# copy package.json & yarn lock files
COPY package.json .
COPY yarn.lock .

# Install app dependencies
RUN yarn

# Bundle app source
COPY . .

# Build app
RUN yarn build

EXPOSE 8000

ENV NODE_ENV=production

# CMD [ "yarn","start:dev" ]
CMD yarn start:prod
