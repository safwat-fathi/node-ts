FROM node:14.20.1

# CREATE APP DIRECTORY
WORKDIR /usr/src

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn

# Bundle app source
COPY . .

EXPOSE 8080

CMD ["NODE_ENV=development","nodemon","./src"]