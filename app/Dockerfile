FROM python:3.11-alpine

WORKDIR /app

COPY requirements.txt /app

RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt

RUN apk update && apk add --no-cache \
    bash \
    ca-certificates \
    gnupg \
    wget \
    postgresql-client

RUN addgroup -S docker && adduser -S vscode -G docker -s /bin/bash

COPY . /app/
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
