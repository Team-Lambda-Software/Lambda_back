FROM node:16.8-alpine3.11 as builder


ENV NODE_ENV build


WORKDIR /home/node


COPY . /home/node


RUN npm ci \
    && npm run build \
    && npm prune --production


# ---


FROM node:16.8-alpine3.11


ENV NODE_ENV production

USER node
WORKDIR /home/node


COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/


CMD ["node", "dist/main.js"]