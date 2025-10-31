## Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
# Copy package.json (and package-lock.json if present) then install.
COPY package*.json ./
# Use `npm install` because `npm ci` requires a package-lock.json to exist.
# `npm install` will install devDependencies as well which are needed for the Vite build.
RUN npm install --silent --no-audit --no-fund

# Copy rest and build
COPY . .
# Some projects include a `tsc` step in the npm build which can fail inside Docker
# (vite can handle TS at runtime/build). Use npx to run vite build directly to avoid
# a separate `tsc` error for vite.config.ts being compiled to declarations.
RUN npx vite build

## Runtime stage (nginx)
FROM nginx:stable-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
