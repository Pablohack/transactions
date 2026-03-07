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

Se implementan tests mínimos pero efectivos:

1. **Componentes UI**: Tests de render y comportamiento (`Button.test.tsx`)
2. **Utilidades**: Tests de helpers de formato (`format.test.ts`)
3. **Formularios**: Validación con TanStack Form + Zod

### Ejecutar Tests

```bash
npm test              # Watch mode
npm run test:coverage # Con reporte de cobertura
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
