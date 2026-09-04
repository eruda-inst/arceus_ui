import z from "zod";
import { LoginInSchema } from "@/schemas/login.schema";

type LoginInType = z.infer<typeof LoginInSchema>;

export type { LoginInType };
