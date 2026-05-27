# Backend for Gas IAM

## Tech Stack

- Python 3.12
- Django 6
- Django REST Framework

## Default Accounts

- Username: gas_admin
- Password: `ptZaJ2njsX!oiAo`

## Test

```bash
docker exec -it gas-iam-backend-1 pytest .
```

## Deployment

```bash
docker build --platform linux/amd64 \
  -t asia-northeast1-docker.pkg.dev/gas-iam/gas-iam/backend:latest \
  ./backend
docker push asia-northeast1-docker.pkg.dev/gas-iam/gas-iam/backend:latest
```
