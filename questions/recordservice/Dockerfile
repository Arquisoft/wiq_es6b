# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/recordservice

# Create a new user "appuser"
RUN adduser --disabled-password --gecos '' appuser

# Change ownership of the working directory to "appuser"
RUN chown -R appuser:appuser /usr/src/recordservice

# Change to the new user
USER appuser

# Copy package.json and package-lock.json to the working directory
COPY --chown=appuser:appuser package*.json ./

# Install app dependencies
RUN npm install

# Copy the app source code to the working directory
COPY --chown=appuser:appuser record-model.js ./
COPY --chown=appuser:appuser record-service.js ./
COPY --chown=appuser:appuser record-service.test.js ./
COPY --chown=appuser:appuser openapi.yaml ./

# Expose the port the app runs on
EXPOSE 8006

# Define the command to run your app
CMD ["node", "record-service.js"]
