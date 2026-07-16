import z from "zod";
import { Departments } from "@/types/department.type";

const LogOutSchema = z.object({
  id: z.number().positive(),
  ip: z.string(),
  metodo: z.string(),
  endpoint: z.string(),
  codigo: z.number().positive(),
  data: z.string(),
  hora: z.string(),
  duracao: z.float64(),
  protocolo: z.string(),
  payload: z.string(),
  resposta: z.string().nullable(),
  url: z.string(),
  cliente: z.string(),
  dominio: z.string(),
  setor: z.enum(Departments),
});

const LogPaginationOutSchema = z.object({
  dados: z.array(LogOutSchema),
  pagina_atual: z.number().positive(),
  itens_por_pagina: z.number().positive(),
  total_paginas: z.number().nonnegative(),
  total_itens: z.number().nonnegative(),
});

const LogFilterInSchema = z.object({
  metodo: z.enum(["GET", "POST", "PUT"]).optional(),
  codigo: z
    .number()
    .refine((val) => [200, 201, 401, 403, 404, 422, 500].includes(val), {
      message: "Código HTTP inválido",
    })
    .optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  hora_inicio: z.string().optional(),
  hora_fim: z.string().optional(),
  endpoint: z.string().optional(),
  cliente: z.string().optional(),
  setor: z.enum(Departments).optional(),
  protocolo: z.string().optional(),
});

export { LogOutSchema, LogPaginationOutSchema, LogFilterInSchema };
