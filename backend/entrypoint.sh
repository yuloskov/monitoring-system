#!/bin/bash

set -ex

if [ "$1" = 'gunicorn' ]; then
  exec $@ \
    -w 4 \
    -b 0.0.0.0:5000 \
    wsgi:app
fi

exec "$@"
