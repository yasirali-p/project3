# Base image with Node.js
FROM node:18

# Install Docker CLI
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy files and install dependencies
COPY package*.json ./
RUN npm install
COPY . .

# Expose app port
EXPOSE 3000

# Run app
CMD ["node", "app.js"]
