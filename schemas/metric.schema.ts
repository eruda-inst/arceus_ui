import z from "zod";

export const TopEndpointSchema = z.object({
  endpoint: z.string(),
  total_requisicoes: z.number().int().nonnegative(),
});
export const TopStatusCodeSchema = z.object({
  status_code: z.number().int().nonnegative(),
  total_respostas: z.number().int().nonnegative(),
});
export const TopHourSchema = z.object({
  hora: z.number().int().nonnegative(),
  total_requisicoes: z.number().int().nonnegative(),
});
export const TopWeekdaySchema = z.object({
  dia_semana: z.string(),
  total_requisicoes: z.number().int().nonnegative(),
});
export const TopWorstEndpointSchema = z.object({
  endpoint: z.string(),
  total_erros: z.number().int().nonnegative(),
});
export const TopMonthDaySchema = z.object({
  dia_mes: z.number().int().min(1).max(31),
  total_requisicoes: z.number().int().nonnegative(),
});
export const TopSlowestEndpointSchema = z.object({
  endpoint: z.string(),
  duracao: z.number(),
});
export const TopHttpMethodSchema = z.object({
  metodo_http: z.string(),
  total_requisicoes: z.number(),
});
export const TopDepartmentSchema = z.object({
  setor: z.string(),
  total_requisicoes: z.number(),
});
export const TopClientSchema = z.object({
  nome_cliente: z.string(),
  total_requisicoes: z.number(),
});
export const SuccessStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  percentual: z.number(),
});
export const ErrorStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  percentual: z.number(),
});
export const TodayAlwaysOutSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    hoje: itemSchema,
    sempre: itemSchema,
  });
export const TotalReqsSchema = TodayAlwaysOutSchema(z.number().nonnegative());
export const TotalServicesSchema = TodayAlwaysOutSchema(
  z.number().nonnegative(),
);
export const TopEndpointsSchema = TodayAlwaysOutSchema(
  z.array(TopEndpointSchema),
);
export const TopStatusCodesSchema = TodayAlwaysOutSchema(
  z.array(TopStatusCodeSchema),
);
export const TopHoursSchema = TodayAlwaysOutSchema(z.array(TopHourSchema));
export const TopWeekdaysSchema = TodayAlwaysOutSchema(
  z.array(TopWeekdaySchema),
);
export const TopWorstEndpointsSchema = TodayAlwaysOutSchema(
  z.array(TopWorstEndpointSchema),
);
export const TopMonthDaysSchema = TodayAlwaysOutSchema(
  z.array(TopMonthDaySchema),
);
export const TopSlowestEndpointsSchema = TodayAlwaysOutSchema(
  z.array(TopSlowestEndpointSchema),
);
export const TopHttpMethodsSchema = TodayAlwaysOutSchema(
  z.array(TopHttpMethodSchema),
);
export const TopDepartmentsSchema = TodayAlwaysOutSchema(
  z.array(TopDepartmentSchema),
);
export const SuccessStatsResponseSchema =
  TodayAlwaysOutSchema(SuccessStatsSchema);
export const ErrorStatsResponseSchema = TodayAlwaysOutSchema(ErrorStatsSchema);
export const ResponseTimeStatsSchema = z.object({
  min: z.number(),
  avg: z.number(),
  max: z.number(),
});
export const ResTimeSchema = TodayAlwaysOutSchema(ResponseTimeStatsSchema);
export const TopClientsSchema = TodayAlwaysOutSchema(z.array(TopClientSchema));
