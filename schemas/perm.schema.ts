import z from "zod";

const PermOutSchema = z.object({
  id: z.number().positive(),
  nome: z.string(),
  codigo: z.string(),
  criado_em: z.string(),
});

export { PermOutSchema };
