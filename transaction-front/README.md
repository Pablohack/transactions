# Transaction Front - Tenpo

Aplicación frontend moderna para gestión de transacciones construida con React, TypeScript, Vite y arquitectura Feature Model.

## 🚀 Características

- 📊 **Gestión completa de transacciones**: Crear, editar, listar y eliminar transacciones
- 🎨 **Tema Tenpo**: Interfaz con los colores característicos de Tenpo (verde vibrante + dark mode)
- 📱 **Diseño responsive**: Mobile-first, adaptable a todos los dispositivos
- ♿ **Accesible**: Cumple estándares AA de accesibilidad
- 🧪 **Testeado**: Tests unitarios con Vitest y Testing Library
- 🏗️ **Arquitectura Feature Model**: Código modular, escalable y mantenible
- ⚡ **Optimizado**: Carga rápida y manejo eficiente de estado con React Query

## 🛠️ Stack Tecnológico

### Core
- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server

### Gestión de Estado y Datos
- **TanStack Query** (React Query) - Fetching, caching e invalidaciones
- **Axios** - Cliente HTTP con interceptores

### UI y Formularios
- **TanStack Table** - Tablas con sorting y paginación
- **TanStack Form** - Formularios con validación
- **Tailwind CSS** - Estilos utilitarios
- **Sonner** - Notificaciones toast

### Validación y Formato
- **Zod** - Validación de schemas
- **date-fns** - Manejo de fechas con locale español

### Testing
- **Vitest** - Test runner
- **Testing Library** - Testing de componentes React

### Routing
- **React Router DOM** - Navegación

## 📁 Arquitectura: Feature Model

El proyecto sigue una arquitectura basada en features para máxima modularidad:

```
src/
├── app/                    # Bootstrap de la aplicación
│   ├── providers/         # Providers globales (React Query, etc.)
│   ├── routes/            # Configuración de rutas
│   └── App.tsx            # Componente raíz
│
├── pages/                  # Páginas que orquestan features
│   └── TransactionsPage.tsx
│
├── features/              # Features del negocio
│   └── transactions/      # Feature de transacciones
│       ├── api/          # Llamadas HTTP con axios
│       ├── model/        # Tipos, schemas Zod, constantes
│       ├── hooks/        # React Query hooks
│       └── ui/           # Componentes UI específicos
│
└── shared/               # Código compartido
    ├── lib/             # Utilidades (axios client, helpers)
    ├── ui/              # Componentes UI atómicos
    ├── config/          # Configuración global
    └── types/           # Tipos globales
```

### Reglas de dependencia
- ✅ `pages` → `features` + `shared`
- ✅ `features` → `shared`
- ❌ `features` NO dependen entre sí
- ❌ `shared` NO depende de `features` ni `pages`

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (usa `.env.example` como referencia):

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

**Descripción de variables:**
- `VITE_API_BASE_URL`: URL base del backend para las API calls

## 📦 Instalación y Ejecución

### Requisitos previos
- Node.js >= 20.17.0
- npm >= 10.8.2

### Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de ambiente
cp .env.example .env

# Editar .env con tu configuración
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### Build de Producción

```bash
# Generar build optimizado
npm run build

# Preview del build
npm run preview
```

### Tests

```bash
# Ejecutar tests en modo watch
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests con UI
npm run test:ui
```

### Linting

```bash
# Ejecutar ESLint
npm run lint
```

## 🎨 Tema Tenpo

El tema se configura mediante CSS variables en `src/index.css`:

```css
:root {
  /* Colores primarios (verde Tenpo) */
  --color-primary: #00d98b;
  --color-primary-hover: #00c37e;
  --color-primary-active: #00ad71;
  
  /* Superficies (dark mode) */
  --color-surface: #0f1419;
  --color-surface-elevated: #1a1f26;
  --color-surface-border: #2d3339;
  
  /* Textos */
  --color-text-primary: #ffffff;
  --color-text-secondary: #9ca3af;
  --color-text-disabled: #6b7280;
  
  /* Estados */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
}
```

Tailwind CSS consume estas variables automáticamente.

## 🔌 API Integration

### Endpoints utilizados

Todos los endpoints se consumen exclusivamente con **axios** (no fetch nativo):

```
GET    /transactions?search=&page=&pageSize=&sortBy=&sortDir=
GET    /transactions/:id
POST   /transactions
PUT    /transactions/:id
DELETE /transactions/:id
```

### Modelo de Transacción

```typescript
interface Transaction {
  id?: number;                // Entero, auto-generado en creación
  amount: number;             // Monto en pesos (entero positivo)
  business: string;           // Giro/Comercio (1-120 chars)
  tenpista: string;           // Nombre del Tenpista (1-120 chars)
  date: string;               // Fecha en formato ISO 8601
}
```

### Validación

Se usa Zod para validar datos antes de envío:

```typescript
const transactionSchema = z.object({
  amount: z.number().int().positive(),
  business: z.string().min(1).max(120),
  tenpista: z.string().min(1).max(120),
  date: z.string().datetime(),
});
```

## 🧪 Testing

### Estrategia de Testing

Se implementan tests unitarios por capa siguiendo el patrón **Arrange-Act-Assert**:

| Archivo | Capa | Qué testea |
|---------|------|-------------|
| `TransactionForm.test.tsx` | UI (feature) | Renderizado, validación Zod campo por campo, creación/edición, estados disabled |
| `TransactionsTable.test.tsx` | UI (feature) | Estados loading/error/empty, renderizado de datos, acciones editar/eliminar, paginación, sorting |
| `useTransactions.test.tsx` | Hooks (feature) | CRUD con React Query, invalidación de cache, manejo de errores, reintentos |
| `useTransactionActions.test.tsx` | Hooks (page) | Flujos completos crear/editar/eliminar, gestión de modales, estado del formulario |
| `Button.test.tsx` | UI (shared) | Variantes, tamaños, estado loading, props HTML nativas |
| `format.test.ts` | Lib (shared) | `formatCurrency`, `formatDate`, `formatDateForInput`, `toISOString`, `parseCurrency` |

### Estructura de tests

```
src/
├── features/transactions/
│   ├── hooks/useTransactions.test.tsx     # Hooks React Query (CRUD)
│   └── ui/
│       ├── TransactionForm.test.tsx       # Formulario + validación
│       └── TransactionsTable.test.tsx     # Tabla + paginación + sorting
├── pages/hooks/
│   └── useTransactionActions.test.tsx     # Flujos de página
├── shared/
│   ├── lib/format.test.ts                # Utilidades de formato
│   └── ui/Button.test.tsx                # Componente atómico
└── test/
    ├── setup.ts                          # Configuración global (jest-dom, cleanup)
    └── mocks/styleMock.ts                # Mock de CSS imports
```

### Configuración

- **Runner**: [Vitest](https://vitest.dev/) con entorno `happy-dom`
- **Assertions**: `@testing-library/jest-dom` para matchers de DOM
- **Render**: `@testing-library/react` + `@testing-library/user-event`
- **Cobertura**: Provider `v8`, reporters `text`, `json`, `html`

### Ejecutar Tests

```bash
# Watch mode (desarrollo)
npm test

# Ejecución única (CI)
npm run test -- --run

# Con reporte de cobertura
npm run test:coverage

# Con UI interactiva de Vitest
npm run test:ui

# Archivo específico
npm run test TransactionForm.test.tsx
```

## 🧩 Patrones de Diseño

| Patrón | Ubicación | Descripción |
|--------|-----------|-------------|
| **Feature Model** | `src/features/` | Cada feature agrupa api, model, hooks y ui de forma autocontenida |
| **Custom Hooks** | `useTransactions`, `useTransactionActions` | Encapsulan lógica de negocio y estado, separándola de la UI |
| **Container / Presentational** | `TransactionsPage` / `TransactionsTable`, `TransactionForm` | Pages orquestan estado y lógica; componentes UI solo reciben props |
| **Barrel Exports** | `index.ts` en cada carpeta | Re-exportan módulos para imports limpios (`@/features/transactions`) |
| **Provider Pattern** | `QueryProvider` | Envuelve la app para inyectar dependencias (QueryClient) |
| **Error Boundary** | `ErrorBoundary` (class component) | Captura errores de renderizado y muestra fallback |
| **Singleton** | `AxiosClient` | Instancia única de Axios con interceptores centralizados |
| **Adapter** | `axiosClient` interceptores | Normaliza errores HTTP a un tipo `ApiError` consistente |
| **Schema Validation** | `types.ts` con Zod | Schemas reutilizables para validar datos en formularios y API |
| **Lazy Loading** | `AppRoutes.tsx` | `React.lazy()` + `Suspense` para code-splitting por ruta |
| **Compound Components** | `Modal` con `footer` slot | Componente compuesto que acepta contenido y footer como props |
| **Headless UI** | TanStack Table / Form | Lógica sin opinión visual, renderizado controlado por el consumidor |

## 🐳 Docker — Ejecución Individual

El proyecto incluye un **Dockerfile multi-stage** para construir y servir la aplicación de forma independiente.

### Estructura del Dockerfile

```dockerfile
# Etapa 1: Build con Node 20
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Construir la imagen

```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8080/api \
  -t transaction-front .
```

> `VITE_API_BASE_URL` se inyecta en **build time** porque Vite reemplaza las variables de entorno durante la compilación.

### Ejecutar el contenedor

```bash
docker run -d -p 3000:80 --name transaction-front transaction-front
```

La aplicación estará disponible en **http://localhost:3000**.

### Nginx

El archivo `nginx.conf` configura un servidor SPA que redirige todas las rutas a `index.html`:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📝 Decisiones de Arquitectura

### ¿Por qué Feature Model?

- **Escalabilidad**: Fácil agregar nuevas features sin tocar código existente
- **Mantenibilidad**: Cada feature es autocontenida
- **Colaboración**: Múltiples devs pueden trabajar en features sin conflictos
- **Testing**: Features aisladas son más fáciles de testear

### ¿Por qué TanStack (React Query + Table + Form)?

- **React Query**: Manejo de estado servidor con cache, retry e invalidaciones automáticas
- **TanStack Table**: Tabla headless con sorting/paginación sin dependencias pesadas
- **TanStack Form**: Formularios performantes con validación tipada

### ¿Por qué Axios sobre Fetch?

- **Interceptores**: Manejo centralizado de headers y errores
- **Normalización**: Transformación consistente de respuestas
- **Timeout**: Control de timeouts out-of-the-box
- **Request/Response typing**: Mejor integración con TypeScript

### Internacionalización

- **Moneda**: `Intl.NumberFormat` con locale `es-CL`
- **Fechas**: `date-fns` con locale español
- **Formato de fecha**: `dd/MM/yyyy HH:mm` (local) → ISO 8601 (servidor)

## 🎯 Funcionalidades Implementadas

### ✅ Listado de Transacciones
- Tabla con columnas: Id, Monto (CLP), Giro/Comercio, Tenpista, Fecha
- Sorting por columnas (client-side)
- Paginación (10 items por página)
- Estados de loading, error y vacío

### ✅ Formulario de Transacciones
- Crear y editar transacciones
- Validación con TanStack Form + Zod
- Mensajes de error por campo
- Estados disabled durante envío
- Toasts de éxito/error

### ✅ Acciones
- ✏️ Editar transacción (modal)
- 🗑️ Eliminar con confirmación (modal)
- ➕ Crear nueva transacción (modal)

### ✅ Gestión de Estado
- React Query para fetching/mutations
- Invalidación automática de cache
- Retry conservador en errores
- Optimistic updates opcionales

## 🌐 Navegación

- `/` → Redirige a `/transactions`
- `/transactions` → Página principal de transacciones
- Rutas no encontradas → Redirige a `/transactions`

## 🔐 Accesibilidad

- ✅ Roles ARIA en componentes
- ✅ Labels asociados a inputs
- ✅ Navegación por teclado (Tab, Enter, Escape)
- ✅ Estados de loading/error anunciados
- ✅ Contraste AA en textos y botones
- ✅ Focus visible en elementos interactivos

## 📚 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm test` | Tests en watch mode |
| `npm run test:coverage` | Tests con cobertura |
| `npm run lint` | Lint del código |

## 🤝 Contribución

1. Sigue la arquitectura Feature Model establecida
2. Mantén las reglas de dependencia
3. Usa TypeScript estricto (`strict: true`)
4. Escribe tests para nuevas features
5. Usa commits descriptivos

## 📄 Licencia

Este proyecto es privado y confidencial.

---

**Desarrollado con 💚 usando el stack moderno de React**
