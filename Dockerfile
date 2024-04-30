FROM node:21.7-alpine3.19 as builder


ENV NODE_ENV build


WORKDIR /home/node

COPY . .


RUN npm ci \
    && npm run build \
    && npm prune --production


# ---


FROM node:21.7-alpine3.19


ENV NODE_ENV production



USER node
WORKDIR /home/node

EXPOSE 3000

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/


CMD ["node", "dist/main.js"]