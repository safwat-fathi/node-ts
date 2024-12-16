FROM node:18-alpine

# Create app directory
WORKDIR /usr/app

# copy package.json & yarn lock files
COPY yarn.lock .

# Install app dependencies
RUN yarn

# Bundle app source
COPY . .

# Build app
RUN yarn build

EXPOSE 4000

ENV NODE_ENV=production

CMD [ "yarn","start:prod" ]
