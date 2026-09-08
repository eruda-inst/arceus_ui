import z from "zod";
import { HttpStatusCode } from "axios";

/**
 * Valid HTTP methods as per the API.
 */
const HTTPMethodSchema = z.enum(["GET", "DELETE", "PATCH", "POST", "PUT"]);

/**
 * Valid HTTP status codes expected in log entries.
 * Derived from axios HttpStatusCode enum.
 */
const HTTPStatusCodeSchema = z.literal([
  HttpStatusCode.Ok, // 200
  HttpStatusCode.Created, // 201
  HttpStatusCode.Unauthorized, // 401
  HttpStatusCode.Forbidden, // 403
  HttpStatusCode.NotFound, // 404
  HttpStatusCode.UnprocessableEntity, // 422
  HttpStatusCode.InternalServerError, // 500
]);

/**
 * Business sectors used for filtering and categorizing logs.
 */
const SectorSchema = z.enum([
  "Cobrança",
  "Comercial",
  "Financeiro",
  "Suporte",
  "Triagem",
  "Upgrade",
  "Vila",
]);

/**
 * Input filter schema for logs.
 * All fields are optional; used to build query parameters.
 */
const LogFilterInSchema = z.object({
  metodo: HTTPMethodSchema.optional(), // HTTP method
  codigo: HTTPStatusCodeSchema.optional(), // HTTP status code
  data_inicio: z.string().optional(), // Start date (ISO string)
  data_fim: z.string().optional(), // End date (ISO string)
  hora_inicio: z.string().optional(), // Start time (HH:mm:ss)
  hora_fim: z.string().optional(), // End time (HH:mm:ss)
  endpoint: z.string().optional(), // API endpoint path
  setor: SectorSchema.optional(), // Business sector
  protocolo: z.string().optional(), // Request protocol (e.g., NWT...)
  nome_cliente: z.string().optional(), // Client name
});

/**
 * Detailed log entry schema for a single log record.
 */
const LogOutSchema = z.object({
  id: z.number().positive(), // Unique log ID
  metodo: z.string(), // HTTP method
  endpoint: z.string(), // API endpoint
  codigo: z.number().positive(), // HTTP status code
  duracao: z.number(), // Request duration in milliseconds
  protocolo: z.string().nullable(), // Protocol identifier
  payload: z.string().nullable(), // Request payload (if any)
  resposta: z.string(), // Response body
  url: z.string(), // Full request URL
  setor: SectorSchema, // Business sector
  criado_em: z.string(), // Creation timestamp (ISO string)
  nome_cliente: z.string().nullable(), // Client name
});

/**
 * Paginated list response schema for logs.
 */
const LogListOutSchema = z.object({
  data: z.array(LogOutSchema), // Array of log entries
  meta: z.object({
    pagina_atual: z.number().positive(), // Current page number
    itens_por_pagina: z.number().positive(), // Items per page
    total_paginas: z.number().nonnegative(), // Total number of pages
    total_itens: z.number().nonnegative(), // Total item count
  }),
});

/**
 * Query parameters schema for log listing endpoints.
 * Used for validation of incoming request query strings.
 */
const LogParamsInSchema = z.object({
  pagina: z.int().min(1).default(1).optional(),
  itens_por_pagina: z.int().min(1).max(100).default(10).optional(),
  metodo: z.string().optional(),
  endpoint: z.string().optional(),
  codigo: z.number().positive().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  hora_inicio: z.string().optional(),
  hora_fim: z.string().optional(),
  protocolo: z.string().optional(),
  setor: z.string().optional(),
  nome_cliente: z.string().optional(),
});

export {
  HTTPMethodSchema,
  HTTPStatusCodeSchema,
  LogFilterInSchema,
  LogListOutSchema,
  LogOutSchema,
  LogParamsInSchema,
  SectorSchema,
};
