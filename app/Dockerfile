FROM python:3.11-alpine
ENV PYTHONUNBUFFERED=1 
WORKDIR /pizza

USER root

COPY requirements.txt /pizza

RUN apk update && apk add --no-cache \
    bash \
    ca-certificates \
    gnupg \
    wget \
    postgresql-client \
    dos2unix

RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt

COPY . /pizza

RUN chmod +x /pizza/entrypoint.sh && dos2unix /pizza/entrypoint.sh

ENTRYPOINT ["/pizza/entrypoint.sh"]
EXPOSE 8000
