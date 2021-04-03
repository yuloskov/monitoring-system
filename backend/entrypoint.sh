#!/bin/bash

set -ex

if [ "$1" = 'uwsgi' ]; then
  [[ -S /tmp/sockets/wsgi.sock ]] && rm /tmp/sockets/wsgi.sock
  exec $@ \
      --master \
      --processes=2 \
      --threads=2 \
      --harakiri=60 \
      --max-requests=100 \
      --module=wsgi:app \
      --socket=/tmp/sockets/wsgi.sock \
      --chmod-socket=666
fi

exec "$@"
