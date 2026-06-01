import z from "zod";

const LoginInSchema = z.object({
  email: z.email(),
  senha: z.string().min(8),
});

const LoginOutSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  token_type: z.string().min(1),
  expires_in: z.number().positive(),
});

export { LoginInSchema, LoginOutSchema };
