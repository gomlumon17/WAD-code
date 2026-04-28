# Use Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy project files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining project files
COPY . .

# Install Angular CLI
RUN npm install -g @angular/cli

# Expose Angular port
EXPOSE 4200

# Run Angular development server
CMD ["ng", "serve", "--host", "0.0.0.0"]