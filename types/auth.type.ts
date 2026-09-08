import z from "zod";
import { LoginInSchema, LoginOutSchema } from "@/schemas/auth.schema";

/** Type inferred from login request schema */
type LoginInType = z.infer<typeof LoginInSchema>;

/** Type inferred from login response schema */
type LoginOutType = z.infer<typeof LoginOutSchema>;

export type { LoginInType, LoginOutType };
