# Step 1: Build the application
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Install sudo (in case you need it for future tasks)
RUN apt-get update && apt-get install -y sudo

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Build the application for production
RUN npm run build

# Step 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built React app from the previous stage into Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the HTTP server
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
