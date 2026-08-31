import z from "zod";

const UserFilterInSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  groupName: z.string().optional(),
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
});

const UserPaginationOutSchema = z.object({
  data: z.array(UserOutSchema),
  meta: z.object({
    pagina_atual: z.number().positive(),
    itens_por_pagina: z.number().positive(),
    total_paginas: z.number().nonnegative(),
    total_itens: z.number().nonnegative(),
  }),
});

export {
  UserFilterInSchema,
  UserInSchema,
  UserOutSchema,
  UserPaginationOutSchema,
};
