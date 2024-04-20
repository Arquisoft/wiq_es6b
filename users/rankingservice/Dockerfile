# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/rankingservice

# Copy package.json and package-lock.json to the working directory
COPY --chown=root:root --chmod=75 package*.json ./

# Install app dependencies
RUN npm install

# Copy the app source code to the working directory
COPY --chown=root:root --chmod=75 ranking-model.js ./
COPY --chown=root:root --chmod=75 ranking-service.js ./
COPY --chown=root:root --chmod=75 ranking-service.test.js ./
COPY --chown=root:root --chmod=75 openapi.yaml ./

# Expose the port the app runs on
EXPOSE 8004

# Define the command to run your app
CMD ["node", "ranking-service.js"]