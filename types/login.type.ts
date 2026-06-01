import z from "zod";
import { LoginInSchema, LoginOutSchema } from "@/schemas/login.schema";

type LoginIn = z.infer<typeof LoginInSchema>;
type LoginOut = z.infer<typeof LoginOutSchema>;

export type { LoginIn, LoginOut };
