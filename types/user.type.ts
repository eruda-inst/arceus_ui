import z from "zod";
import {
  UserFilterInSchema,
  UserInSchema,
  UserOutSchema,
  UserListOutSchema,
  UserParamsInSchema,
} from "@/schemas/user.schema";

type UserFilterInType = z.infer<typeof UserFilterInSchema>;

type UserInType = z.infer<typeof UserInSchema>;

type UserListOutType = z.infer<typeof UserListOutSchema>;

type UserOutType = z.infer<typeof UserOutSchema>;

type UserParamsInType = z.infer<typeof UserParamsInSchema>;

export type {
  UserFilterInType,
  UserInType,
  UserListOutType,
  UserOutType,
  UserParamsInType,
};
