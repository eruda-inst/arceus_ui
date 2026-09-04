import { z } from "zod";
import {
  IXCUserOutSchema,
  IXCUserListOutSchema,
} from "@/schemas/ixcUser.schema";

type IXCUserListOutType = z.infer<typeof IXCUserListOutSchema>;

type IXCUserOutType = z.infer<typeof IXCUserOutSchema>;

export type { IXCUserListOutType, IXCUserOutType };
