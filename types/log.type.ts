import { z } from "zod";
import {
  LogOutSchema,
  LogPaginationOutSchema,
  LogFilterInSchema,
  LogParamsInSchema,
} from "@/schemas/log.schema";

type CodeType = 200 | 201 | 401 | 403 | 404 | 422 | 500;

type LogFilterInType = z.infer<typeof LogFilterInSchema>;

type LogListOutType = z.infer<typeof LogPaginationOutSchema>;

type LogOutType = z.infer<typeof LogOutSchema>;

type LogParamsInType = z.infer<typeof LogParamsInSchema>;

type MethodType = "GET" | "POST" | "PUT";

export type {
  CodeType,
  LogFilterInType,
  LogListOutType,
  LogOutType,
  LogParamsInType,
  MethodType,
};
