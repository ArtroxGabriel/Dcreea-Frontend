FROM node:12.22.3-alpine3.11 AS base

FROM base AS deps

WORKDIR /app
 
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build --prod

FROM nginx:mainline-alpine3.18-slim AS nginx

LABEL "author.name"=" authorname" \
"author.email"=" author@email" \
version="1.0.0" desc=" Dcreeaa"

COPY --from=build --chown=gabrigas:nodejs /app/dist/DCREAE-Front/ /usr/share/nginx/html

COPY ./nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80