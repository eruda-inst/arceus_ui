import { z } from "zod";

const IXCUserStatusEnum = z.enum(["Ativo", "Inativo"]);
const IXCUserAccessTypeEnum = z.enum(["Ambos", "Web", "Mobile"]);

export const IXCUserOutSchema = z.object({
  id: z.number().positive(),
  nome: z.string(),
  email: z.email(),
  status: IXCUserStatusEnum.optional().default("Ativo"),
  tipo_acesso: IXCUserAccessTypeEnum.optional().default("Ambos"),
});

export const IXCUserPaginationOutSchema = z.object({
  data: z.array(IXCUserOutSchema),
  meta: z.object({
    pagina_atual: z.number().positive(),
    itens_por_pagina: z.number().positive(),
    total_paginas: z.number().nonnegative(),
    total_itens: z.number().nonnegative(),
  }),
});

export { IXCUserStatusEnum, IXCUserAccessTypeEnum };
