import z from "zod";

const UserFilterInSchema = z.object({
  nome: z.string().optional(),
  email: z.string().optional(),
  ativo: z.boolean().optional(),
  nome_grupo: z.string().optional(),
});

const UserInSchema = z.object({
  nome: z.string(),
  email: z.email(),
  ativo: z.boolean(),
  senha: z.string().min(8),
  id_grupo: z.number().positive(),
});

const UserOutSchema = z.object({
  id: z.number().positive(),
  nome: z.string(),
  email: z.email(),
  ativo: z.boolean(),
  criado_em: z.string(),
  atualizado_em: z.string().nullable(),
  id_grupo: z.number().positive(),
  nome_grupo: z.string(),
});

const UserListOutSchema = z.object({
  data: z.array(UserOutSchema),
  meta: z.object({
    pagina_atual: z.number().positive(),
    itens_por_pagina: z.number().positive(),
    total_paginas: z.number().nonnegative(),
    total_itens: z.number().nonnegative(),
  }),
});

const UserParamsInSchema = z.object({
  pagina: z.int().min(1).default(1).optional(),
  itens_por_pagina: z.int().min(1).max(100).default(10).optional(),

  nome: z.string().optional(),
  email: z.string().optional(),
  ativo: z.boolean().optional(),
  nome_grupo: z.string().optional(),
});

export {
  UserFilterInSchema,
  UserInSchema,
  UserListOutSchema,
  UserOutSchema,
  UserParamsInSchema,
};
