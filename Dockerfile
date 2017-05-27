FROM nginx:1.13.0-alpine

RUN apk add --update bash

COPY ./nginx.conf /etc/nginx
COPY ./listen.conf /etc/nginx/listen.conf

RUN mkdir /xogame123
COPY ./static/ResultScript/result.js /xogame123/ResultScript/result.js
COPY ./static/index.html /xogame123/index.html
COPY ./static/Images /xogame123/Images
COPY ./static/Styles /xogame123/Styles

CMD /bin/bash -c "echo \"listen $PORT;\" > /etc/nginx/listen.conf && nginx -g 'daemon off;'"
