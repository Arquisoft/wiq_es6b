# Use an official Node.js runtime as a parent
FROM node:20

# Create a non-root user: nodeuser
RUN useradd -m nodeuser

# Set the working directory in the container
WORKDIR /usr/src/recordservice

# Copy package.json and package-lock.json to the working directory
COPY --chown=root:root --chmod=755 package*.json ./

# Install app dependencies
RUN npm install --ignore-scripts

# Copy the app source code to the working directory
COPY --chown=root:root --chmod=755 .env ./
COPY --chown=root:root --chmod=755 record-model.js ./
COPY --chown=root:root --chmod=755 record-service.js ./
COPY --chown=root:root --chmod=755 record-service.test.js ./
COPY --chown=root:root --chmod=755 openapi.yaml ./

# Switch to the new user in the Dockerfile
USER nodeuser

# Expose the port the app runs on
EXPOSE 8006

# Define the command to run your app
CMD ["node", "record-service.js"]