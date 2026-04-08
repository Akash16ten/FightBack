# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Run Stage ----
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./
RUN npm prune --omit=dev
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/app.js"]