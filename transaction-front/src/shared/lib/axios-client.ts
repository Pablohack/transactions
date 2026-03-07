import axios, { type AxiosError, type AxiosInstance } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

class AxiosClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Puedes agregar tokens de autenticación aquí si es necesario
        return config;
      },
      (error) => {
        return Promise.reject(this.normalizeError(error));
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private normalizeError(error: AxiosError): ApiError {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const data = error.response.data as Record<string, unknown>;
      return {
        message: (data?.message as string) || 'Error en la solicitud',
        status: error.response.status,
        errors: data?.errors as Record<string, string[]> | undefined,
      };
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      return {
        message: 'No se pudo conectar con el servidor',
        status: 0,
      };
    } else {
      // Algo sucedió al configurar la solicitud
      return {
        message: error.message || 'Error desconocido',
      };
    }
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const axiosClient = new AxiosClient().getInstance();
