# development branch
# Use the Docker Hub Node.js image as a base image
FROM node:18.19.1 AS base

FROM base AS deps
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm install; \
  else echo "Lockfile not found." && exit 1; \
  fi


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Get Rest of the Codes From Context
COPY . .

# Build the NestJS application
RUN npm run build

FROM base AS runner
WORKDIR /app

# # Get NestJS build Files and Code
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env .env
COPY --from=builder /app/.env.development .env.development

EXPOSE 3000
ENV PORT=3000

# # Command to run the application
CMD ["npm", "run", "start:prod"]