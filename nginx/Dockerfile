FROM nginx:1.17

VOLUME ["/tmp/sockets", "/var/www/static", "/var/www/media"]

ARG CONTEXT=frontend

WORKDIR /app

COPY ./$CONTEXT/build /var/www

ARG CONTEXT=nginx

COPY $CONTEXT/config /etc/nginx

CMD ["nginx", "-g", "daemon off;"]
