# syntax=docker/dockerfile:1

FROM node:12.18.1

#The NODE_ENV environment variable specifies the environment in which an application is running 
#(usually, development or production). One of the simplest things you can do to improve performance 
#is to set NODE_ENV to production.
ENV NODE_ENV=production 

#This instructs Docker to use this path as the default location for all subsequent commands. 
#This way we do not have to type out full file paths but can use relative paths based on 
#the working directory.
WORKDIR /app

#COPY ["<src1>", "<src2>",..., "<dest>"]
#copy the package.json and the package-lock.json file into our working directory /app.
COPY ["package.json", "package-lock.json*", "./"]

#Node modules will be installed into the node_modules directory inside our image.
RUN npm install --production

#add our source code into the image
COPY . .

CMD [ "node", "server.js" ]