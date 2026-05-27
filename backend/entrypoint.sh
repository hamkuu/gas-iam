#!/bin/sh

python manage.py migrate

if [ "$DEBUG" = "1" ]; then
  python manage.py runserver 0.0.0.0:8000
else
  exec gunicorn gas_iam.wsgi:application --bind 0.0.0.0:8000 --workers 2
fi
