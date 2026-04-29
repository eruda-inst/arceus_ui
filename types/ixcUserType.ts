import { z } from "zod";
import {
  IXCUserOutSchema,
  IXCUserPaginationOutSchema,
  IXCUserStatusEnum,
  IXCUserAccessTypeEnum,
} from "@/schemas/ixcUserSchema";

type IXCUserOut = z.infer<typeof IXCUserOutSchema>;
type IXCUserPaginationOut = z.infer<typeof IXCUserPaginationOutSchema>;
type IXCUserStatus = z.infer<typeof IXCUserStatusEnum>;
type IXCUserAccessType = z.infer<typeof IXCUserAccessTypeEnum>;

export type {
  IXCUserOut,
  IXCUserPaginationOut,
  IXCUserStatus,
  IXCUserAccessType,
};
