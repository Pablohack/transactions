# Transaction Back — API REST

API REST para gestión de transacciones financieras construida con Spring Boot 3.2, Java 17 y PostgreSQL.

## Arquitectura

El proyecto sigue una **arquitectura por capas (Layered Architecture)** con separación clara de responsabilidades:

```
src/main/java/com/example/transaction_back/
├── TransactionBackApplication.java     # Punto de entrada
├── config/                             # Configuración transversal
│   ├── CorsConfig.java                 # Configuración CORS
│   ├── GlobalExceptionHandler.java     # Manejo centralizado de excepciones
│   └── ModelMapperConfig.java          # Configuración de ModelMapper
├── controller/                         # Capa de presentación (REST)
│   └── TransactionController.java
├── dto/                                # Objetos de transferencia de datos
│   ├── CreateTransactionRequest.java
│   ├── UpdateTransactionRequest.java
│   └── TransactionResponse.java
├── exception/                          # Excepciones de dominio
│   └── ResourceNotFoundException.java
├── mapper/                             # Capa de mapeo Entity ↔ DTO
│   └── TransactionMapper.java
├── model/                              # Entidades JPA
│   └── Transaction.java
├── repository/                         # Capa de acceso a datos
│   └── TransactionRepository.java
└── service/                            # Capa de lógica de negocio
    ├── ITransactionService.java        # Contrato (interfaz)
    └── TransactionServiceImpl.java     # Implementación
```

### Flujo de una petición

```
Cliente HTTP
    │
    ▼
Controller (validación de entrada con @Valid)
    │
    ▼
Service (lógica de negocio + transacciones)
    │
    ▼
Mapper (conversión Entity ↔ DTO con ModelMapper)
    │
    ▼
Repository (acceso a datos con JPA)
    │
    ▼
PostgreSQL
```

## Patrones de Diseño

| Patrón | Dónde se aplica | Descripción |
|--------|-----------------|-------------|
| **DTO (Data Transfer Object)** | `dto/` | Separa la representación externa de la entidad interna. `CreateTransactionRequest`, `UpdateTransactionRequest` y `TransactionResponse` evitan exponer la entidad JPA directamente. |
| **Repository** | `repository/` | `TransactionRepository` extiende `JpaRepository` para abstraer el acceso a datos. |
| **Service Layer** | `service/` | `TransactionServiceImpl` encapsula la lógica de negocio y coordina repository + mapper. |
| **Dependency Injection** | Todo el proyecto | Inyección por constructor con `@RequiredArgsConstructor` de Lombok. |
| **Interface Segregation** | `ITransactionService` | La capa de servicio expone un contrato (interfaz), permitiendo desacoplar la implementación. |
| **Mapper** | `mapper/` | `TransactionMapper` centraliza la conversión entre entidades y DTOs usando ModelMapper, aplicando **DRY**. |
| **Global Exception Handler** | `GlobalExceptionHandler` | `@RestControllerAdvice` centraliza el manejo de errores con respuestas HTTP consistentes. |
| **Builder** | DTOs y entidades | Lombok `@Builder` para construcción fluida de objetos. |
| **Auditoría automática** | `Transaction.java` | `@PrePersist` y `@PreUpdate` de JPA para campos `createdAt` y `updatedAt`. |

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Java | 17 | Lenguaje |
| Spring Boot | 3.2.0 | Framework |
| Spring Data JPA | — | Acceso a datos |
| Spring Validation | — | Validación con Bean Validation |
| PostgreSQL | 42.7.7 | Driver de base de datos |
| H2 | — | Base de datos en memoria para tests |
| Lombok | 1.18.34 | Reducción de boilerplate |
| ModelMapper | 3.2.0 | Mapeo automático de objetos |
| JUnit 5 + Mockito | — | Testing unitario |
| Maven | 3.9 | Build y gestión de dependencias |

## Endpoints

| Método | Ruta | Descripción | Códigos HTTP |
|--------|------|-------------|--------------|
| `GET` | `/api/transactions` | Listar todas las transacciones | 200 |
| `GET` | `/api/transactions/{id}` | Obtener transacción por ID | 200, 404 |
| `POST` | `/api/transactions` | Crear nueva transacción | 201, 400 |
| `PUT` | `/api/transactions/{id}` | Actualizar transacción | 200, 400, 404 |
| `DELETE` | `/api/transactions/{id}` | Eliminar transacción | 204, 404 |

### Ejemplo de request (POST/PUT)

```json
{
  "amount": 50000.00,
  "business": "Supermercado",
  "tenpista": "Juan Pérez",
  "date": "2026-03-09T14:30:00"
}
```

### Validaciones

| Campo | Reglas |
|-------|--------|
| `amount` | Requerido, mayor a 0, máximo 999999999999.99 |
| `business` | Requerido, no vacío, máximo 120 caracteres |
| `tenpista` | Requerido, no vacío, máximo 120 caracteres |
| `date` | Requerido |

## Tests

El proyecto cuenta con tests unitarios para la capa de servicio y la capa de controlador.

### Ejecutar todos los tests

```bash
./mvnw test
```

### Ejecutar tests de un módulo específico

```bash
# Solo tests del servicio
./mvnw test -Dtest="TransactionServiceImplTest"

# Solo tests del controlador
./mvnw test -Dtest="TransactionControllerTest"
```

### Estructura de tests

```
src/test/
├── java/com/example/transaction_back/
│   ├── TransactionBackApplicationTests.java   # Test de carga de contexto
│   ├── controller/
│   │   └── TransactionControllerTest.java     # Tests del controlador (MockMvc)
│   └── service/
│       └── TransactionServiceImplTest.java    # Tests del servicio (Mockito)
└── resources/
    └── application-test.properties            # Configuración H2 para tests
```

- **TransactionControllerTest**: Usa `MockMvc` en modo standalone con `GlobalExceptionHandler`. Valida códigos HTTP, respuestas JSON y validaciones de entrada.
- **TransactionServiceImplTest**: Usa Mockito para mockear `TransactionRepository` y `TransactionMapper`. Valida lógica de negocio y manejo de excepciones.

Los tests usan **H2 en memoria** como base de datos (`application-test.properties`), sin necesidad de PostgreSQL.

## Levantar el Proyecto

### Opción 1: Con Docker (individual)

Requiere una base de datos PostgreSQL accesible. Construir y ejecutar la imagen:

```bash
# Construir la imagen
docker build -t transaction-backend .

# Ejecutar el contenedor
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:<puerto>/transactions \
  -e SPRING_DATASOURCE_USERNAME=admin \
  -e SPRING_DATASOURCE_PASSWORD=admin \
  transaction-backend
```

El Dockerfile usa un **multi-stage build**:
1. **Build stage** (`maven:3.9-eclipse-temurin-17`): Descarga dependencias y compila el proyecto con `mvn clean package -DskipTests`.
2. **Runtime stage** (`eclipse-temurin:17-jre-alpine`): Imagen ligera que solo contiene el JRE y el JAR.

### Opción 2: Con Maven (desarrollo local)

Requiere Java 17+ y una base de datos PostgreSQL en `localhost:5433`:

```bash
./mvnw spring-boot:run
```

### Opción 3: Con Docker Compose (proyecto completo)

Desde la raíz del monorepo, levanta todos los servicios (PostgreSQL, Flyway, backend, frontend):

```bash
docker compose up --build
```

## Configuración

### application.properties

| Propiedad | Valor por defecto | Descripción |
|-----------|-------------------|-------------|
| `server.port` | 8080 | Puerto del servidor |
| `spring.datasource.url` | `jdbc:postgresql://localhost:5433/transactions` | URL de la base de datos |
| `spring.datasource.username` | admin | Usuario de la base de datos |
| `spring.datasource.password` | admin | Contraseña de la base de datos |
| `spring.jpa.hibernate.ddl-auto` | none | No auto-genera esquema (Flyway se encarga) |

Las propiedades se pueden sobreescribir con variables de entorno (ej: `SPRING_DATASOURCE_URL`).
