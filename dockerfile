FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN rm -rf node_modules package-lock.json \
    && npm cache clean --force \
    && npm install --no-package-lock

# Build bcrypt specifically
#RUN npm install bcrypt --build-from-source
RUN npm rebuild bcrypt --build-from-source

COPY . .
EXPOSE 3000
CMD ["npm", "start"]
