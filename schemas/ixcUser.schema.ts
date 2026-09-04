import { z } from "zod";

const IXCUserOutSchema = z.object({
  id: z.number().positive(),
  nome: z.string(),
  email: z.email(),
  status: z.enum(["Ativo", "Inativo"]).optional().default("Ativo"),
  tipo_acesso: z.enum(["Ambos", "Web", "Mobile"]).optional().default("Ambos"),
});

const IXCUserListOutSchema = z.object({
  data: z.array(IXCUserOutSchema),
  meta: z.object({
    pagina_atual: z.number().positive(),
    itens_por_pagina: z.number().positive(),
    total_paginas: z.number().nonnegative(),
    total_itens: z.number().nonnegative(),
  }),
});

export { IXCUserListOutSchema, IXCUserOutSchema };
