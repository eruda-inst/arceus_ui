# Stage 1: Install dependencies and build the application
FROM node:20-alpine AS builder

# --- MUDANÇA 1: Definimos ARGs com valores PLACEHOLDER ---
# Vamos "assar" strings fáceis de encontrar, em vez de URLs reais.
ARG NEXT_PUBLIC_BASE_API_URL=__NEXT_PUBLIC_BASE_API_URL_PLACEHOLDER__
ENV NEXT_PUBLIC_BASE_API_URL=${NEXT_PUBLIC_BASE_API_URL}

ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=__NEXT_SERVER_ACTIONS_ENCRYPTION_KEY_PLACEHOLDER__
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=${NEXT_SERVER_ACTIONS_ENCRYPTION_KEY}

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

# O 'npm run build' agora vai usar os placeholders
RUN npm run build

# Stage 2: Run the application
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV="env"

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# --- MUDANÇA 2: Adicionamos o script de entrypoint ---
# Este script vai rodar ANTES do 'npm start'
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 3000

# --- MUDANÇA 3: Definimos o entrypoint e o CMD ---
# O Entrypoint executa o script, que por sua vez executa o CMD
ENTRYPOINT ["./entrypoint.sh"]
CMD ["yarn", "start"]
