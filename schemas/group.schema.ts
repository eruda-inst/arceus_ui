import z from "zod";

const GroupOutSchema = z.object({
  id: z.number().positive(),
  nome: z.string(),
  criado_em: z.string(),
});

export { GroupOutSchema };
