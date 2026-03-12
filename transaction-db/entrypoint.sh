#!/bin/bash
set -e

# Iniciar PostgreSQL usando el entrypoint original en segundo plano
docker-entrypoint.sh postgres &

# Esperar a que PostgreSQL acepte conexiones
until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" -q; do
  sleep 1
done

# Ejecutar migraciones con Flyway
/flyway/flyway \
  -url="jdbc:postgresql://localhost:5432/$POSTGRES_DB" \
  -user="$POSTGRES_USER" \
  -password="$POSTGRES_PASSWORD" \
  -connectRetries=5 \
  migrate

# Señalizar que las migraciones finalizaron
touch /tmp/flyway_done

# Mantener el contenedor corriendo esperando el proceso de PostgreSQL
wait
