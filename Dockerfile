# Use official Node.js 18 LTS Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app


# Install dependencies first for better caching
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# Environment variables (you can also pass these at runtime)
ENV NODE_ENV=production
ENV JWT_SECRET=ee86f865ab14f9ee71d84cc450b5175386f07961ee0c988cb8efd6cd24671d4e
ENV APP_PORT=8050

# Expose the port the app runs on
EXPOSE ${APP_PORT}

# Command to run the application
CMD ["node", "dist/index.js"]