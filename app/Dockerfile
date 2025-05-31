FROM python:3.11-alpine 
 
WORKDIR /app
 
COPY requirements.txt /app
 
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt 

RUN <<EOF
addgroup -S docker
adduser -S --shell /bin/bash --ingroup docker vscode
EOF

COPY . /app/

 
EXPOSE 8000
CMD ["fastapi", "run", "main.py", "--port", "8000"]