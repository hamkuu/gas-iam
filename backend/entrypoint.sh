#!/bin/sh

python manage.py migrate
python manage.py collectstatic --no-input

if [ "$DEBUG" = "1" ]; then
  python manage.py loaddata accounts/fixtures/users.json
  python manage.py loaddata accounts/fixtures/prefectures.json
  python manage.py runserver 0.0.0.0:8000
else
  exec gunicorn gas_iam.wsgi:application --bind 0.0.0.0:8000 --workers 2
fi
