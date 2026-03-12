# Stage 1: Obtener Flyway y Java runtime
FROM flyway/flyway:10 AS flyway

# Stage 2: PostgreSQL con Flyway integrado
FROM postgres:16

ENV POSTGRES_DB=transactions
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin

# Copiar Java runtime desde la imagen de Flyway
COPY --from=flyway /opt/java/openjdk /opt/java/openjdk
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Copiar Flyway
COPY --from=flyway /flyway /flyway

# Copiar migraciones SQL
COPY sql/ /flyway/sql/

# Copiar entrypoint wrapper
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 5432

ENTRYPOINT ["entrypoint.sh"]
CMD ["postgres"]
