#!/bin/sh
 
set -e
 
while ! PGPASSWORD=${POSTGRES_PASSWORD} psql -h pizza-db -U ${POSTGRES_USER} -c '\q'; do
    echo "Waiting for PostgreSQL to start..."
    sleep 1
done
echo "Database is up. Waiting 2 more seconds to ensure readiness..."
sleep 2
 
if ! PGPASSWORD=${POSTGRES_PASSWORD} psql -U ${POSTGRES_USER} -h pizza-db -p ${POSTGRES_PORT} -lqt | cut -d \| -f 1 | cut -d ' ' -f 2 | grep -q "^pizza_db$"; then
    PGPASSWORD=${POSTGRES_PASSWORD} createdb -U  ${POSTGRES_USER} -h pizza-db -p ${POSTGRES_PORT} pizza_db
else
    echo "La database existe déjà..."
fi
 
export PYTHONPATH=/app
 
uvicorn app.main:app --host 0.0.0.0 --port 8000