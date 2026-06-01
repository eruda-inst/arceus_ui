import { z } from "zod";
import {
  LogOutSchema,
  LogPaginationOutSchema,
  LogFilterInSchema,
} from "@/schemas/log.schema";

type Method = "GET" | "POST" | "PUT";
type Code = 200 | 201 | 401 | 403 | 404 | 422 | 500;
type LogOut = z.infer<typeof LogOutSchema>;
type LogPaginationOut = z.infer<typeof LogPaginationOutSchema>;
type LogFilterIn = z.infer<typeof LogFilterInSchema>;

export type { LogOut, LogPaginationOut, Method, Code, LogFilterIn };
