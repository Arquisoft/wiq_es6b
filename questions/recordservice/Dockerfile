# Use an official Node.js runtime as a parent image
FROM node:20

# Create a non-root user: nodeuser
RUN useradd -m nodeuser

# Set the working directory in the container
WORKDIR /usr/src/recordservice

# Copy package.json and package-lock.json to the working directory
COPY --chown=nodeuser:nodeuser package*.json ./

# Install app dependencies
RUN npm install --ignore-scripts

# Copy the app source code to the working directory
COPY --chown=nodeuser:nodeuser .env ./
COPY --chown=nodeuser:nodeuser record-model.js ./
COPY --chown=nodeuser:nodeuser record-service.js ./
COPY --chown=nodeuser:nodeuser record-service.test.js ./
COPY --chown=nodeuser:nodeuser openapi.yaml ./

# Switch to the new user in the Dockerfile
USER nodeuser

# Expose the port the app runs on
EXPOSE 8006

# Define the command to run your app
CMD ["node", "record-service.js"]