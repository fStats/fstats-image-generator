# Stage 1: Build
FROM node:20-alpine3.21 AS build

WORKDIR /app

ENV NODE_ENV=production

# Install build dependencies
RUN apk add --no-cache \
    python3 make g++ cairo-dev pango-dev jpeg-dev giflib-dev

# Install TypeScript globally
RUN npm install -g typescript

# Copy package.json and package-lock.json
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . /app

# Build the application
RUN npm run build

# Remove dev dependencies and cache
RUN npm prune --production && npm cache clean --force

# Stage 2: Final
FROM node:20-alpine3.21

WORKDIR /app

ENV NODE_ENV=production

# Install runtime dependencies for canvas
RUN apk add --no-cache \
    cairo pango giflib libjpeg \
    font-noto

# Copy only the necessary files from the build stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package-lock.json /app/
COPY --from=build /app/node_modules /app/node_modules

# Expose the application port
EXPOSE 1542

# Command to run the application
CMD ["node", "./dist/index.js"]
