FROM oven/bun as build

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bun build src/index.ts --outdir dist --target bun --minfiy

# Path: Dockerfile
FROM oven/bun as production

COPY --from=build /app/dist /app/dist

EXPOSE 3000

CMD ["bun", "run", "/app/dist/index.js"]

