import z from "zod";

const PermissionOutSchema = z.object({
  id: z.number().positive(),
  nome: z.string(),
  codigo: z.string(),
  criado_em: z.string(),
});

export { PermissionOutSchema };
