FROM node:10.10.0-alpine
# Create app directory

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install -g nodemon && npm install
# If you are building your code for production
# RUN npm install --only=production

EXPOSE 3030
CMD [ "nodemon", "src/" ]