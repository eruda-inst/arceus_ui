interface Log {
  id: number;
  ip: string;
  http_method: string;
  endpoint: string;
  status_code: number;
  data: string;
  hora: string;
  duracao: number;
}

export type { Log };
