FROM mhart/alpine-node:9.11.1
LABEL maintainer="DecentM <decentm@decentm.com>"

RUN mkdir -p /ouc /.yarn /.cache/yarn /.config && touch /.yarnrc /.babel.json
RUN chown 1000:1000 -R /.yarn /.yarnrc /.cache/yarn /.babel.json /.config /ouc

COPY --chown=1000:1000 ./package.json /ouc/
COPY --chown=1000:1000 ./yarn.lock /ouc/
COPY --chown=1000:1000 ./.yarnrc /ouc/

RUN apk --update add git

COPY --chown=1000:1000 ./build /ouc/build
COPY --chown=1000:1000 ./.nuxt /ouc/.nuxt
COPY --chown=1000:1000 ./prod.entrypoint.sh /ouc/
COPY --chown=1000:1000 ./nuxt.config.js /ouc/
COPY --chown=1000:1000 ./.prod.env.local /ouc/
COPY --chown=1000:1000 ./app /ouc/

VOLUME ["/ouc/build/data", "/yarn-cache"]

EXPOSE 5000/tcp
EXPOSE 5010/tcp

CMD ["sh", "/ouc/prod.entrypoint.sh"]
