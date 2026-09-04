import z from "zod";
import {
  UserFilterInTypeSchema,
  UserInSchema,
  UserOutSchema,
  UserPaginationOutSchema,
  UserParamsInSchema,
} from "@/schemas/user.schema";

type UserFilterInType = z.infer<typeof UserFilterInTypeSchema>;

type UserInType = z.infer<typeof UserInSchema>;

type UserListOutType = z.infer<typeof UserPaginationOutSchema>;

type UserOutType = z.infer<typeof UserOutSchema>;

type UserParamsInType = z.infer<typeof UserParamsInSchema>;

export type {
  UserFilterInType,
  UserInType,
  UserListOutType,
  UserOutType,
  UserParamsInType,
};
