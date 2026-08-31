import z from "zod";
import {
  UserFilterInSchema,
  UserInSchema,
  UserOutSchema,
  UserPaginationOutSchema,
} from "@/schemas/user.schema";

type UserFilterIn = z.infer<typeof UserFilterInSchema>;
type UserIn = z.infer<typeof UserInSchema>;
type UserOut = z.infer<typeof UserOutSchema>;
type UserPaginationOut = z.infer<typeof UserPaginationOutSchema>;

export type { UserOut, UserIn, UserPaginationOut, UserFilterIn };
