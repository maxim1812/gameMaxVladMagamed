echo "Start docker..."
FROM nginx:1.13.0-alpine

RUN apk add --update bash

COPY ./nginx.conf /etc/nginx
COPY ./public /usr/share/nginx/html

CMD /bin/bash -c "echo \"listen $PORT;\" > /etc/nginx/listen.conf && nginx -g 'daemon off;'"
