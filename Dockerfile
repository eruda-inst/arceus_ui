FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
ARG NEXT_PUBLIC_BASE_API_URL=__NEXT_PUBLIC_BASE_API_URL_PLACEHOLDER__
ENV NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_API_URL

ARG NEXT_PUBLIC_BASE_WS_API_URL=__NEXT_PUBLIC_BASE_WS_API_URL_PLACEHOLDER__
ENV NEXT_PUBLIC_BASE_WS_API_URL=$NEXT_PUBLIC_BASE_WS_API_URL
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
CMD ["yarn", "start"]
