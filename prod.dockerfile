FROM mhart/alpine-node:9.11.1
LABEL maintainer="DecentM <decentm@decentm.com>"

RUN mkdir -p /ouc/app /.yarn /.cache/yarn /.config && touch /.yarnrc /.babel.json
RUN chown 1000:1000 -R /.yarn /.yarnrc /.cache/yarn /.babel.json /.config /ouc

RUN apk --update add git

COPY --chown=1000:1000 ./build /ouc/build
COPY --chown=1000:1000 ./.nuxt /ouc/.nuxt
COPY --chown=1000:1000 ./prod.entrypoint.sh /ouc/
COPY --chown=1000:1000 ./nuxt.config.js /ouc/
COPY --chown=1000:1000 ./.prod.env.local /ouc/.env
COPY --chown=1000:1000 ./app/static /ouc/app/static

VOLUME ["/ouc/build/data"]

EXPOSE 5000/tcp
EXPOSE 5010/tcp

COPY --chown=1000:1000 ./.yarnrc /ouc/
COPY --chown=1000:1000 ./yarn.lock /ouc/
COPY --chown=1000:1000 ./package.json /ouc/

RUN cd /ouc && yarn \
  --frozen-lockfile \
  --non-interactive \
  --network-timeout 10000 \
  --network-concurrency 3 \
  --production

CMD ["sh", "/ouc/prod.entrypoint.sh"]
