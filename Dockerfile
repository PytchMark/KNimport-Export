FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY client ./client
COPY server ./server
COPY supabase ./supabase
COPY README.md ./
RUN npm install
RUN npm run build
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
