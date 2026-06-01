import z from "zod";
import {
  UserOutSchema,
  UserPaginationOutSchema,
  UserUpdateSchema,
  UserFilterInSchema,
  UserInSchema,
} from "@/schemas/user.schema";

type UserOut = z.infer<typeof UserOutSchema>;

type UserPaginationOut = z.infer<typeof UserPaginationOutSchema>;

type UserUpdate = z.infer<typeof UserUpdateSchema>;

type UserFilterIn = z.infer<typeof UserFilterInSchema>;

type UserIn = z.infer<typeof UserInSchema>;

export type { UserOut, UserPaginationOut, UserUpdate, UserFilterIn, UserIn };
