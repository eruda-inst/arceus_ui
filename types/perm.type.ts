import z from "zod";
import { PermOutSchema } from "@/schemas/perm.schema";

type PermOutType = z.infer<typeof PermOutSchema>;

export type { PermOutType };
