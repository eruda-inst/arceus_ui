import z from "zod";
import { PermOutSchema } from "@/schemas/perm.schema";

type PermOut = z.infer<typeof PermOutSchema>;

export type { PermOut };
