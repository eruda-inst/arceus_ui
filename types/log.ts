interface Log {
  id: number;
  ip: string;
  metodo_http: string;
  endpoint: string;
  status_code: number;
  data: string;
  hora: string;
  duracao: number;
}

export type { Log };
