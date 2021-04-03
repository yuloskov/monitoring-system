#!/bin/bash

set -ex

if [ "$1" = 'uwsgi' ]; then
  exec $@ \
      --http :5000
      --master \
      --processes=2 \
      --threads=2 \
      --harakiri=60 \
      --max-requests=100 \
      --module=wsgi
fi

exec "$@"
