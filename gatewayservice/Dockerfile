# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/gatewayservice

# Create a new user "appuser"
RUN adduser --disabled-password --gecos '' appuser

# Change ownership of the working directory to "appuser"
RUN chown -R appuser:appuser /usr/src/gatewayservice

# Change to the new user
USER appuser

# Copy package.json and package-lock.json to the working directory
COPY --chown=appuser:appuser package*.json ./

# Install app dependencies
RUN npm install

# Copy the app source code to the working directory
COPY --chown=appuser:appuser gateway-service.js ./
COPY --chown=appuser:appuser gateway-service.test.js ./
COPY --chown=appuser:appuser openapi.yaml ./

# Define the command to run your app
CMD ["node", "gateway-service.js"]
