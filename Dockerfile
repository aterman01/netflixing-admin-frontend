FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (needed for build AND runtime)
RUN npm ci

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the preview server (vite needs to be available)
CMD ["npm", "run", "start"]
