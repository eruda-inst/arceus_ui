import { z } from "zod";
import {
  HTTPMethodSchema,
  HTTPStatusCodeSchema,
  LogFilterInSchema,
  LogListOutSchema,
  LogOutSchema,
  LogParamsInSchema,
  SectorSchema,
} from "@/schemas/log.schema";

/** Allowed HTTP methods for log filtering */
type HTTPMethodType = z.infer<typeof HTTPMethodSchema>;

/** Allowed HTTP status codes for log filtering */
type HTTPStatusCodeType = z.infer<typeof HTTPStatusCodeSchema>;

/** Input filter parameters for querying logs */
type LogFilterInType = z.infer<typeof LogFilterInSchema>;

/** Paginated list response containing log entries and metadata */
type LogListOutType = z.infer<typeof LogListOutSchema>;

/** Single log entry structure */
type LogOutType = z.infer<typeof LogOutSchema>;

/** Query parameters for log listing (pagination and filters) */
type LogParamsInType = z.infer<typeof LogParamsInSchema>;

/** Business sector values */
type SectorType = z.infer<typeof SectorSchema>;

export type {
  HTTPMethodType,
  HTTPStatusCodeType,
  LogFilterInType,
  LogListOutType,
  LogOutType,
  LogParamsInType,
  SectorType,
};
