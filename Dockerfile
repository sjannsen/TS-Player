FROM node:19-slim as dependency-base
    WORKDIR /app

    COPY package*.json /app/

FROM dependency-base as build
    # Install dependencies (with dev-deps)
    RUN npm ci

    COPY . /app/
    RUN npm run compile

FROM dependency-base as runtime-dependencies
    RUN NODE_ENV=production npm ci

FROM node:19-slim
    WORKDIR /app

    ENV NODE_ENV=production
    ENV HTTP_HOST=0.0.0.0

    ENV TZ 'Europe/Berlin'
    RUN cp /usr/share/zoneinfo/${TZ} /etc/localtime

    COPY --from=runtime-dependencies /app/node_modules /app/node_modules
    COPY --from=build /app/package.json /app/package.json
    COPY --from=build /app/dist /app/dist

    ENTRYPOINT ["npm", "run", "start"]
