import z from "zod";

const LoginInSchema = z.object({
  email: z.email(),
  senha: z.string().min(8),
});

export { LoginInSchema };
