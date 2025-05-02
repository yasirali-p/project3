FROM node:18

# Create and set working directory
WORKDIR /usr/src/app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the correct port (matches your app.js)
EXPOSE 5000

# Command to run the application
CMD ["node", "app.js"]
