FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PYTHONIOENCODING=utf-8

COPY --from=ghcr.io/astral-sh/uv:0.11 /uv /uvx /bin/
ENV UV_SYSTEM_PYTHON=1 UV_PROJECT_ENVIRONMENT=/usr/local/

WORKDIR /app

COPY pyproject.toml uv.lock ./
COPY . .

RUN uv sync --frozen --no-dev

EXPOSE 8000

ENTRYPOINT ["sh", "entrypoint.sh"]
