import z from "zod";
import { PermOutSchema } from "@/schemas/perm.schema";

type PermOut = z.infer<typeof PermOutSchema>;

type PermCheck = {
  hasPerm: boolean;
  isLoading: boolean;
};

export type { PermOut, PermCheck };
