# Tests Unitarios - Transaction Front

Este documento describe los tests unitarios implementados para la aplicación de gestión de transacciones.

## 📋 Cobertura de Tests

### 1. **TransactionForm.test.tsx**
Tests del formulario de creación/edición de transacciones.

**Casos de prueba:**
- ✅ Creación de transacción
  - Renderizado del formulario vacío
  - Validación de campos requeridos
  - Validación de monto (mayor a 0, no exceder máximo)
  - Validación de longitud de campos de texto (máx 120 caracteres)
  - Creación exitosa con datos válidos
  
- ✅ Edición de transacción
  - Renderizado con datos existentes
  - Actualización de transacción
  
- ✅ Interacciones
  - Botón de cancelar
  - Estado de carga (isSubmitting)
  - Deshabilitación de inputs durante envío
  
- ✅ Validación de fecha
  - No permitir fechas futuras

### 2. **TransactionsTable.test.tsx**
Tests de la tabla de listado de transacciones.

**Casos de prueba:**
- ✅ Estados de carga
  - Loading state
  - Error state
  - Empty state
  - Retry functionality
  
- ✅ Renderizado de datos
  - Listado de transacciones
  - Headers de tabla
  - Formateo de moneda
  - Mostrar IDs
  
- ✅ Acciones
  - Editar transacción
  - Eliminar transacción
  - Botones por cada fila
  
- ✅ Paginación
  - 10 items por página
  - Navegación (siguiente/anterior)
  - Información de paginación
  - Deshabilitar botones en primera/última página
  
- ✅ Ordenamiento
  - Indicadores de ordenamiento en headers

### 3. **useTransactions.test.ts**
Tests de hooks de React Query para operaciones CRUD.

**Casos de prueba:**
- ✅ useTransactions (Listado)
  - Obtener transacciones exitosamente
  - Manejo de errores
  - Reintentos (2 veces)
  
- ✅ useCreateTransaction
  - Crear transacción exitosamente
  - Manejo de errores
  - Estado de carga (isPending)
  
- ✅ useUpdateTransaction
  - Actualizar transacción exitosamente
  - Manejo de errores
  
- ✅ useDeleteTransaction
  - Eliminar transacción exitosamente
  - Manejo de errores
  - Invalidación de cache

### 4. **useTransactionActions.test.ts**
Tests del custom hook que maneja las acciones de la página.

**Casos de prueba:**
- ✅ Estado inicial
- ✅ handleCreate - Abrir modal para crear
- ✅ handleEdit - Abrir modal con transacción seleccionada
- ✅ handleDelete - Preparar eliminación
- ✅ handleSubmit - Crear/actualizar según contexto
- ✅ handleConfirmDelete - Confirmar y ejecutar eliminación
- ✅ handleCancelDelete - Cancelar eliminación
- ✅ handleCloseFormModal - Cerrar modal
- ✅ Flujos completos
  - Creación completa
  - Edición completa
  - Eliminación completa

## 🚀 Ejecutar Tests

### Ejecutar todos los tests
```bash
npm run test
```

### Ejecutar tests en modo watch
```bash
npm run test -- --watch
```

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

### Ejecutar tests con UI interactiva
```bash
npm run test:ui
```

### Ejecutar un archivo de test específico
```bash
npm run test TransactionForm.test.tsx
```

## 📊 Estructura de Tests

```
src/
├── features/
│   └── transactions/
│       ├── ui/
│       │   ├── TransactionForm.tsx
│       │   ├── TransactionForm.test.tsx ✅
│       │   ├── TransactionsTable.tsx
│       │   └── TransactionsTable.test.tsx ✅
│       └── hooks/
│           ├── useTransactions.ts
│           └── useTransactions.test.ts ✅
└── pages/
    └── hooks/
        ├── useTransactionActions.ts
        └── useTransactionActions.test.ts ✅
```

## 🛠️ Tecnologías de Testing

- **Vitest**: Framework de testing (compatible con Jest)
- **React Testing Library**: Testing de componentes React
- **@testing-library/user-event**: Simulación de interacciones de usuario
- **@testing-library/react**: Hooks de testing para React Query

## 📝 Convenciones de Testing

### Nombres de tests
- Usar `describe()` para agrupar tests relacionados
- Usar `it()` o `test()` para casos individuales
- Descripción en español, clara y específica

### Mocks
- Mockear APIs usando `vi.mock()`
- Limpiar mocks entre tests con `beforeEach()`
- Usar `vi.clearAllMocks()` para reset

### Assertions
- Usar matchers específicos: `toBeInTheDocument()`, `toHaveValue()`, etc.
- Esperar cambios asincrónicos con `waitFor()`
- Usar `act()` para operaciones que actualizan estado

### User Events
```typescript
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'text');
```

## 🎯 Buenas Prácticas

1. **Testear comportamiento, no implementación**
   - Usar queries por rol/label (accesibilidad)
   - Evitar testear detalles internos

2. **Tests independientes**
   - Limpiar estado entre tests
   - No depender del orden de ejecución

3. **Cobertura completa**
   - Happy path (flujo exitoso)
   - Error handling
   - Edge cases (casos límite)
   - Estados de carga

4. **Mantener tests simples**
   - Un concepto por test
   - Nombres descriptivos
   - Arrange-Act-Assert

## 🔍 Debugging Tests

### Ver output en la consola
```bash
npm run test -- --reporter=verbose
```

### Debug con breakpoints
```typescript
import { debug } from '@testing-library/react';

// En el test
debug(); // Imprime el DOM actual
```

### Ver queries disponibles
```typescript
screen.logTestingPlaygroundURL();
```

## 📈 Métricas de Cobertura

Los tests cubren:
- ✅ Componentes UI (TransactionForm, TransactionsTable)
- ✅ Custom hooks (useTransactions, useTransactionActions)
- ✅ Flujos de usuario completos (CRUD)
- ✅ Validaciones de formulario
- ✅ Manejo de errores
- ✅ Estados de carga

**Objetivo:** >80% de cobertura en componentes críticos
