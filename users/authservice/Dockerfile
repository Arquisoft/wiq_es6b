# Use an official Node.js runtime as a parent
FROM node:20

# Create a non-root user: nodeuser
RUN useradd -m nodeuser

# Set the working directory in the container
WORKDIR /usr/src/authservice

# Copy package.json and package-lock.json to the working directory
COPY --chown=nodeuser:nodeuser package*.json ./

# Install app dependencies
RUN npm install --ignore-scripts

# Copy the app source code to the working directory
COPY --chown=nodeuser:nodeuser .env ./
COPY --chown=nodeuser:nodeuser auth-model.js ./
COPY --chown=nodeuser:nodeuser auth-service.js ./
COPY --chown=nodeuser:nodeuser auth-service.test.js ./
COPY --chown=nodeuser:nodeuser openapi.yaml ./

# Remove write permissions from all files
RUN chmod -R 444 .

# Switch to the new user in the Dockerfile
USER nodeuser

# Expose the port the app runs on
EXPOSE 8002

# Define the command to run your app
CMD ["node", "auth-service.js"]