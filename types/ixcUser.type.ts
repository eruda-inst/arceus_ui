import { z } from "zod";
import {
  IXCUserOutSchema,
  IXCUserPaginationOutSchema,
} from "@/schemas/ixcUser.schema";

type IXCUserOut = z.infer<typeof IXCUserOutSchema>;
type IXCUserPaginationOut = z.infer<typeof IXCUserPaginationOutSchema>;

export type { IXCUserOut, IXCUserPaginationOut };
