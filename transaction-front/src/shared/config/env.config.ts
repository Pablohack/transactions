
const env = {
  API_URL: import.meta.env.VITE_API_BASE_URL as string,
} as const;

// Validación al iniciar la app
if (!env.API_URL) {
  throw new Error('VITE_API_BASE_URL no está definida en .env');
}

export default env;