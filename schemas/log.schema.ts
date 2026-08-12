import z from "zod";
import { Departments } from "@/types/department.type";

const LogOutSchema = z.object({
  id: z.number().positive(),
  metodo: z.string(),
  endpoint: z.string(),
  codigo: z.number().positive(),
  duracao: z.number(),
  protocolo: z.string().nullable(),
  payload: z.string().nullable(),
  resposta: z.string(),
  url: z.string(),
  setor: z.enum(Departments),
  criado_em: z.string(),
  nome_cliente: z.string().nullable(),
});

const LogPaginationOutSchema = z.object({
  data: z.array(LogOutSchema),
  meta: z.object({
    pagina_atual: z.number().positive(),
    itens_por_pagina: z.number().positive(),
    total_paginas: z.number().nonnegative(),
    total_itens: z.number().nonnegative(),
  }),
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
  setor: z.enum(Departments).optional(),
  protocolo: z.string().optional(),
  nome_cliente: z.string().optional(),
});

export { LogOutSchema, LogPaginationOutSchema, LogFilterInSchema };
