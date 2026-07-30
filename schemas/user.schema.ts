import z from "zod";

const UserOutSchema = z.object({
  id: z.number().positive(),
  nome: z.string(),
  email: z.string().email(),
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

// Os demais schemas permanecem iguais
const UserInSchema = z.object({
  senha: z.string().min(8),
  nome: z.string(),
  email: z.string().email(),
  id_grupo: z.number().positive(),
  ativo: z.boolean().default(true).optional(),
});

const UserUpdateSchema = z.object({
  nome: z.string().optional(),
  email: z.string().email().optional(),
  ativo: z.boolean().optional(),
  senha: z.string().min(8).optional(),
  id_grupo: z.number().positive().optional(),
});

const UserFilterInSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  groupName: z.string().optional(),
});

export {
  UserOutSchema,
  UserPaginationOutSchema,
  UserUpdateSchema,
  UserFilterInSchema,
  UserInSchema,
};
