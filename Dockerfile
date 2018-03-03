FROM mhart/alpine-node:9.2.0
LABEL maintainer="DecentM <decentm@decentm.com>"

RUN apk update
RUN apk add python make g++ krb5-dev git supervisor

RUN mkdir /ouc
COPY ./build/ /ouc/
COPY ./package.json /ouc/package.json
COPY ./entrypoint.sh /ouc/entrypoint.sh
COPY ./.npmrc /ouc/.npmrc
COPY ./supervisord.conf /etc/supervisord.conf

RUN chmod 555 /ouc/entrypoint.sh
RUN cd /ouc && yarn --frozen-lockfile
RUN apk del python make g++ krb5-dev

EXPOSE 5001/tcp
EXPOSE 5011/tcp

CMD ["sh", "/ouc/entrypoint.sh"]
