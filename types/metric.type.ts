import {
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
} from "@/schemas/metric.schema";
import type z from "zod";

type ErrorStats = z.infer<typeof ErrorStatsSchema>;
type SuccessStats = z.infer<typeof SuccessStatsSchema>;
interface TodayAlwaysOut<T> {
  hoje: T;
  sempre: T;
}
type TopClient = z.infer<typeof TopClientSchema>;
type TopDepartment = z.infer<typeof TopDepartmentSchema>;
type TopEndpoint = z.infer<typeof TopEndpointSchema>;
type TopHour = z.infer<typeof TopHourSchema>;
interface TopHourFormatted {
  hora: string;
  total_requisicoes: number;
}
type TopHttpMethod = z.infer<typeof TopHttpMethodSchema>;
type TopMonthDay = z.infer<typeof TopMonthDaySchema>;
type TopSlowestEndpoint = z.infer<typeof TopSlowestEndpointSchema>;
type TopStatusCode = z.infer<typeof TopStatusCodeSchema>;
type TopWeekday = z.infer<typeof TopWeekdaySchema>;
type TopWorstEndpoint = z.infer<typeof TopWorstEndpointSchema>;

export type {
  ErrorStats,
  SuccessStats,
  TodayAlwaysOut,
  TopClient,
  TopDepartment,
  TopEndpoint,
  TopHour,
  TopHourFormatted,
  TopHttpMethod,
  TopMonthDay,
  TopSlowestEndpoint,
  TopStatusCode,
  TopWeekday,
  TopWorstEndpoint,
};
