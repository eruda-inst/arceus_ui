import z from "zod";

/**
 * Schema for login request payload.
 * Validates that email is a valid email address and password has at least 8 characters.
 */
const LoginInSchema = z.object({
  email: z.email(),
  senha: z.string().min(8),
});

/**
 * Schema for login response payload.
 * Contains authentication tokens and their metadata.
 */
const LoginOutSchema = z.object({
  access_token: z.string(), // JWT access token
  refresh_token: z.string(), // JWT refresh token for obtaining new access tokens
  token_type: z.string(), // e.g., "Bearer"
  expires_in: z.number().int().nonnegative(), // Token expiration time in seconds
});

export { LoginInSchema, LoginOutSchema };
