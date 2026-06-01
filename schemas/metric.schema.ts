// metricSchema.ts (extended)
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
export const TodayAlwaysOutSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    hoje: itemSchema,
    sempre: itemSchema,
  });
export const TotalReqsSchema = TodayAlwaysOutSchema(z.number().nonnegative());
export const AvgResTimeSchema = TodayAlwaysOutSchema(z.number());
export const SuccessRateSchema = TodayAlwaysOutSchema(z.number());
export const ErrorRateSchema = TodayAlwaysOutSchema(z.number());
export const TotalErrorsSchema = TodayAlwaysOutSchema(z.number().nonnegative());
export const TotalSuccessesSchema = TodayAlwaysOutSchema(
  z.number().nonnegative(),
);
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
