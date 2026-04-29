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
  dados: z.array(IXCUserOutSchema),
  pagina_atual: z.number().positive(),
  itens_por_pagina: z.number().positive(),
  total_paginas: z.number().positive(),
  total_itens: z.number().gte(0),
});

export { IXCUserStatusEnum, IXCUserAccessTypeEnum };
