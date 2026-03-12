# Desafío Transacciones

Sistema de gestión de transacciones financieras compuesto por un frontend en React, un backend en Spring Boot y una base de datos PostgreSQL con migraciones versionadas mediante Flyway.

## Estructura del Monorepo

```
DesafioTransacciones/
├── docker-compose.yml          # Orquestador de todos los servicios
├── transaction-db/             # Base de datos y migraciones
│   ├── Dockerfile              # PostgreSQL 16 + Flyway 10 (multi-stage)
│   ├── entrypoint.sh           # Script que inicia PostgreSQL y ejecuta migraciones
│   └── sql/                    # Scripts de migración Flyway
│       └── V1__init.sql        # Migración inicial: tabla transactions
├── transaction-back/           # API REST (Spring Boot)
│   ├── Dockerfile              # Maven build + JRE 17 (multi-stage)
│   ├── pom.xml
│   └── src/
├── transaction-front/          # Aplicación web (React + Vite)
│   ├── Dockerfile              # Node build + Nginx (multi-stage)
│   ├── nginx.conf
│   └── src/
```

## Servicios

| Servicio   | Contenedor             | Puerto externo | Descripción                                      |
|------------|------------------------|----------------|--------------------------------------------------|
| postgres   | local-database         | 5433           | PostgreSQL 16 con Flyway integrado               |
| pgadmin    | local-pgadmin          | 5050           | Interfaz web para administrar la base de datos    |
| backend    | transaction-backend    | 8080           | API REST Spring Boot (Java 17)                   |
| frontend   | transaction-frontend   | 3000           | Aplicación React servida con Nginx               |

## Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2+)

## Levantar el Proyecto

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd DesafioTransacciones
```

### 2. Construir y levantar todos los servicios

```bash
docker compose up --build
```

Esto ejecuta todo en primer plano. Para ejecutar en segundo plano (modo detached):

```bash
docker compose up --build -d
```

### 3. Verificar que los servicios estén corriendo

```bash
docker compose ps
```

### 4. Acceder a los servicios

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api
- **pgAdmin:** http://localhost:5050
  - Email: `admin@admin.com`
  - Contraseña: `admin`

## Orden de Inicio de los Servicios

`docker-compose.yml` define el siguiente flujo de dependencias:

```
postgres (build desde transaction-db/)
   │
   ├──► Inicia PostgreSQL
   ├──► Ejecuta migraciones Flyway automáticamente
   ├──► Healthcheck: pg_isready + /tmp/flyway_done
   │
   ├──► pgadmin (espera: service_healthy)
   │
   └──► backend (espera: service_healthy)
            │
            └──► frontend (espera: backend listo)
```

### Detalle del proceso:

1. **postgres** — Se construye la imagen desde `transaction-db/Dockerfile` (multi-stage: copia Flyway y Java desde `flyway/flyway:10` sobre `postgres:16`). Al iniciar, `entrypoint.sh`:
   - Arranca PostgreSQL en segundo plano.
   - Espera a que acepte conexiones (`pg_isready`).
   - Ejecuta `flyway migrate` con los scripts SQL de `sql/`.
   - Marca `/tmp/flyway_done` para señalizar que las migraciones finalizaron.
   - El healthcheck valida **ambas** condiciones: PostgreSQL listo **y** migraciones completadas.

2. **pgadmin** — Se levanta una vez que `postgres` está healthy (PostgreSQL + migraciones listas).

3. **backend** — Se construye desde `transaction-back/Dockerfile` (multi-stage: Maven build + JRE 17 runtime). Arranca solo cuando `postgres` está healthy, asegurando que la base de datos y las tablas ya existen.

4. **frontend** — Se construye desde `transaction-front/Dockerfile` (multi-stage: Node build + Nginx). Arranca después del backend. La variable `VITE_API_BASE_URL` se inyecta en build time.

## Migraciones de Base de Datos

Las migraciones SQL están en `transaction-db/sql/` y siguen la convención de Flyway:

```
V<versión>__<descripción>.sql
```

Para agregar una nueva migración, crear un archivo como `V2__add_column.sql` en `transaction-db/sql/`. Se ejecutará automáticamente en el siguiente inicio del contenedor.

## Comandos Útiles

```bash
# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes (borra datos de PostgreSQL)
docker compose down -v

# Reconstruir un servicio específico
docker compose up --build <servicio>

# Ver logs de un servicio
docker compose logs -f <servicio>

# Ver logs de todos los servicios
docker compose logs -f
```

## Variables de Entorno

### postgres

| Variable            | Valor          |
|---------------------|----------------|
| POSTGRES_DB         | transactions   |
| POSTGRES_USER       | admin          |
| POSTGRES_PASSWORD   | admin          |

### backend

| Variable                      | Valor                                            |
|-------------------------------|--------------------------------------------------|
| SPRING_DATASOURCE_URL         | jdbc:postgresql://postgres:5432/transactions     |
| SPRING_DATASOURCE_USERNAME    | admin                                            |
| SPRING_DATASOURCE_PASSWORD    | admin                                            |

### frontend

| Variable           | Valor (build arg)          |
|--------------------|----------------------------|
| VITE_API_BASE_URL  | http://localhost:8080/api   |

### pgadmin

| Variable                | Valor              |
|-------------------------|--------------------|
| PGADMIN_DEFAULT_EMAIL   | admin@admin.com    |
| PGADMIN_DEFAULT_PASSWORD| admin              |
