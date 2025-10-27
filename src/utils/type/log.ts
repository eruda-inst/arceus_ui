interface Log {
  ip: string;
  http_method: number;
  endpoint: string;
  status_code: number;
  data: string;
  hora: string;
  duracao: number;
}

export type { Log };
