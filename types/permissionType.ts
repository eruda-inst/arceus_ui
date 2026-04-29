import z from "zod";
import { PermissionOutSchema } from "@/schemas/permissionSchema";

type PermissionOut = z.infer<typeof PermissionOutSchema>;

type PermissionCheck = {
  hasPermission: boolean;
  isLoading: boolean;
};

export type { PermissionOut, PermissionCheck };
