FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies cleanly
RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force
RUN npm install --no-package-lock

# Build bcrypt specifically
RUN npm install bcrypt --build-from-source

COPY . .
EXPOSE 3000
CMD ["npm", "start"]
