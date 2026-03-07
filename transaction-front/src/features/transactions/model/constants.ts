export const TRANSACTION_QUERY_KEYS = {
  all: ['transactions'] as const,
  lists: () => [...TRANSACTION_QUERY_KEYS.all, 'list'] as const,
  list: (params: Record<string, any>) => [...TRANSACTION_QUERY_KEYS.lists(), params] as const,
  details: () => [...TRANSACTION_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...TRANSACTION_QUERY_KEYS.details(), id] as const,
};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const SORT_COLUMNS = {
  id: 'Id',
  amount: 'Monto',
  business: 'Giro/Comercio',
  tenpista: 'Tenpista',
  date: 'Fecha',
} as const;

export type SortColumn = keyof typeof SORT_COLUMNS;
