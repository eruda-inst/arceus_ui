import { z } from "zod";
import {
  IXCUserOutSchema,
  IXCUserPaginationOutSchema,
} from "@/schemas/ixcUser.schema";

type IXCUserListOutType = z.infer<typeof IXCUserPaginationOutSchema>;

type IXCUserOutType = z.infer<typeof IXCUserOutSchema>;

export type { IXCUserListOutType, IXCUserOutType };
