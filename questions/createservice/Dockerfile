# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/createservice

# Create a new user "appuser"
RUN adduser --disabled-password --gecos '' appuser

# Change ownership of the working directory to "appuser"
RUN chown -R appuser:appuser /usr/src/createservice

# Change to the new user
USER appuser

# Copy package.json and package-lock.json to the working directory
COPY --chown=appuser:appuser package*.json ./

# Install app dependencies
RUN npm install

# Copy the app source code to the working directory
COPY --chown=appuser:appuser create-model.js ./
COPY --chown=appuser:appuser create-service.js ./
COPY --chown=appuser:appuser create-service.test.js ./
COPY --chown=appuser:appuser openapi.yaml ./

# Remove write permissions for all users from the executable
RUN chmod a-w user-service.js

# Expose the port the app runs on
EXPOSE 8005

# Define the command to run your app
CMD ["node", "create-service.js"]
