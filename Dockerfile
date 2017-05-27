FROM nginx:1.13.0-alpine

RUN apk add --update bash

COPY ./nginx.conf /etc/nginx
COPY ./public /usr/share/nginx/html

RUN mkdir /xogame123
COPY ./static/ResultScript/result.js /xogame123/result.js
COPY ./static/index.html /xogame123/index.html
COPY ./static/Images /xogame123/Images

CMD /bin/bash -c "echo \"listen $PORT;\" > /etc/nginx/listen.conf && nginx -g 'daemon off;'"
