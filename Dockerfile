# syntax=docker/dockerfile:1
FROM oven/bun:1.1.12

WORKDIR /app

COPY package.json tsconfig.json drizzle.config.ts ./
COPY src ./src
COPY drizzle ./drizzle
COPY scripts ./scripts

RUN bun install

EXPOSE 3000

CMD ["bun", "run", "src/server.ts"]
