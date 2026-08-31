import { z } from "zod";
import {
  LogOutSchema,
  LogPaginationOutSchema,
  LogFilterInSchema,
} from "@/schemas/log.schema";

type Code = 200 | 201 | 401 | 403 | 404 | 422 | 500;
type LogFilterIn = z.infer<typeof LogFilterInSchema>;
type LogOut = z.infer<typeof LogOutSchema>;
type LogPaginationOut = z.infer<typeof LogPaginationOutSchema>;
type Method = "GET" | "POST" | "PUT";

export type { Code, LogFilterIn, LogOut, LogPaginationOut, Method };
