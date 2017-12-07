FROM mhart/alpine-node:9.2.0
LABEL maintainer="DecentM <decentm@decentm.com>"

RUN apk update
RUN apk add python make g++ krb5-dev

RUN mkdir /ouc
COPY ./build/ /ouc/
COPY ./package.json /ouc/package.json
COPY ./entrypoint.sh /ouc/entrypoint.sh
COPY ./.npmrc /ouc/.npmrc

RUN chmod 555 /ouc/entrypoint.sh
RUN cd /ouc && npm i --only=production
RUN apk del python make g++ krb5-dev

EXPOSE 5001/tcp
EXPOSE 5011/tcp

CMD ["ash", "/ouc/entrypoint.sh"]

