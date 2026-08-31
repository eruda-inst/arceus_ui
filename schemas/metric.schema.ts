import z from "zod";

const TopEndpointSchema = z.object({
  endpoint: z.string(),
  total_requisicoes: z.number().int().nonnegative(),
});
const TopStatusCodeSchema = z.object({
  status_code: z.number().int().nonnegative(),
  total_respostas: z.number().int().nonnegative(),
});
const TopHourSchema = z.object({
  hora: z.number().int().nonnegative(),
  total_requisicoes: z.number().int().nonnegative(),
});
const TopWeekdaySchema = z.object({
  dia_semana: z.string(),
  total_requisicoes: z.number().int().nonnegative(),
});
const TopWorstEndpointSchema = z.object({
  endpoint: z.string(),
  total_erros: z.number().int().nonnegative(),
});
const TopMonthDaySchema = z.object({
  dia_mes: z.number().int().min(1).max(31),
  total_requisicoes: z.number().int().nonnegative(),
});
const TopSlowestEndpointSchema = z.object({
  endpoint: z.string(),
  duracao: z.number(),
});
const TopHttpMethodSchema = z.object({
  metodo_http: z.string(),
  total_requisicoes: z.number(),
});
const TopDepartmentSchema = z.object({
  setor: z.string(),
  total_requisicoes: z.number(),
});
const TopClientSchema = z.object({
  nome_cliente: z.string(),
  total_requisicoes: z.number(),
});
const SuccessStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  percentual: z.number(),
});
const ErrorStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  percentual: z.number(),
});

export {
  TopEndpointSchema,
  TopStatusCodeSchema,
  TopHourSchema,
  TopWeekdaySchema,
  TopWorstEndpointSchema,
  TopMonthDaySchema,
  TopSlowestEndpointSchema,
  TopHttpMethodSchema,
  TopDepartmentSchema,
  SuccessStatsSchema,
  ErrorStatsSchema,
  TopClientSchema,
};
