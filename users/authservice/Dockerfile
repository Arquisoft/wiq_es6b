# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/authservice

# Create a new user "appuser"
RUN adduser --disabled-password --gecos '' appuser

# Change ownership of the working directory to "appuser"
RUN chown -R appuser:appuser /usr/src/authservice

# Change to the new user
USER appuser

# Copy package.json and package-lock.json to the working directory
COPY --chown=appuser:appuser package*.json ./

# Install app dependencies
RUN npm install

# Copy the app source code to the working directory
COPY --chown=appuser:appuser auth-model.js ./
COPY --chown=appuser:appuser auth-service.js ./
COPY --chown=appuser:appuser auth-service.test.js ./
COPY --chown=appuser:appuser openapi.yaml ./

# Expose the port the app runs on
EXPOSE 8002

# Define the command to run your app
CMD ["node", "auth-service.js"]
