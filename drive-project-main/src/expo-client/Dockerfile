# Base image
FROM node:18

# Working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Expo ports
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Run Expo in tunnel mode (accessible from phone) or standard
CMD ["npx", "expo", "start", "--tunnel"]