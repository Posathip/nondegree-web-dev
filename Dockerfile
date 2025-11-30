
FROM node:18.14.2
# ded

WORKDIR /app

# 3. Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm ci --production

# 5. Copy  project
COPY . .
COPY .env .env

# 6. Expose port
EXPOSE 3000



# 8. Start app with nodemon for dev or node for prod
CMD ["node", "bin/www"]
