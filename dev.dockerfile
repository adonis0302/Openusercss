FROM mhart/alpine-node:9.11.1
LABEL maintainer="DecentM <decentm@decentm.com>"

RUN apk update
RUN apk add python make g++ krb5-dev git

RUN mkdir -p /.yarn /.cache/yarn /.config && touch /.yarnrc /.babel.json
RUN chown 1000:1000 -R /.yarn /.yarnrc /.cache/yarn /.babel.json /.config

VOLUME ["/ouc", "/ouc/build/data"]
ENV PATH "${PATH}:node_modules/.bin"

EXPOSE 5001/tcp
EXPOSE 5011/tcp

CMD ["sh", "/ouc/dev.entrypoint.sh"]
