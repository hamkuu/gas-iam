#!/bin/sh

python manage.py migrate
python manage.py loaddata accounts/fixtures/users.json
python manage.py loaddata accounts/fixtures/prefectures.json

python manage.py runserver 0.0.0.0:8000
