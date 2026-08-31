import z from "zod";
import { LoginInSchema } from "@/schemas/login.schema";

type LoginIn = z.infer<typeof LoginInSchema>;

export type { LoginIn };
