FROM python:3.11-alpine
ENV PYTHONUNBUFFERED=1 
WORKDIR /pizza

COPY requirements.txt /pizza
USER root

RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt

RUN apk update && apk add --no-cache \
    bash \
    ca-certificates \
    gnupg \
    wget \
    postgresql-client

COPY entrypoint.sh /pizza/entrypoint.sh
RUN sed -i 's/\r$//' /pizza/entrypoint.sh && chmod +x /pizza/entrypoint.sh

COPY . /pizza

EXPOSE 8000
ENTRYPOINT ["/pizza/entrypoint.sh"]
