import {
  TopEndpointSchema,
  TopStatusCodeSchema,
  TopHourSchema,
  TopWeekdaySchema,
  TopWorstEndpointSchema,
  TopMonthDaySchema,
  TotalReqsSchema,
  AvgResTimeSchema,
  SuccessRateSchema,
  ErrorRateSchema,
  TotalErrorsSchema,
  TotalSuccessesSchema,
  TotalServicesSchema,
  TopEndpointsSchema,
  TopStatusCodesSchema,
  TopHoursSchema,
  TopWeekdaysSchema,
  TopWorstEndpointsSchema,
  TopMonthDaysSchema,
} from "@/schemas/metricSchema";
import type z from "zod";

export type TopEndpoint = z.infer<typeof TopEndpointSchema>;
export type TopStatusCode = z.infer<typeof TopStatusCodeSchema>;
export type TopHour = z.infer<typeof TopHourSchema>;
export type TopWeekday = z.infer<typeof TopWeekdaySchema>;
export type TopWorstEndpoint = z.infer<typeof TopWorstEndpointSchema>;
export type TopMonthDay = z.infer<typeof TopMonthDaySchema>;
export interface TodayAlwaysOut<T> {
  hoje: T;
  sempre: T;
}
export interface TopHourFormatted {
  hora: string; // ex: "13 h"
  total_requisicoes: number;
}
export type TotalReqs = z.infer<typeof TotalReqsSchema>;
export type AvgResTime = z.infer<typeof AvgResTimeSchema>;
export type SuccessRate = z.infer<typeof SuccessRateSchema>;
export type ErrorRate = z.infer<typeof ErrorRateSchema>;
export type TotalErrors = z.infer<typeof TotalErrorsSchema>;
export type TotalSuccesses = z.infer<typeof TotalSuccessesSchema>;
export type TotalServices = z.infer<typeof TotalServicesSchema>;
export type TopEndpoints = z.infer<typeof TopEndpointsSchema>;
export type TopStatusCodes = z.infer<typeof TopStatusCodesSchema>;
export type TopHours = z.infer<typeof TopHoursSchema>;
export type TopWeekdays = z.infer<typeof TopWeekdaysSchema>;
export type TopWorstEndpoints = z.infer<typeof TopWorstEndpointsSchema>;
export type TopMonthDays = z.infer<typeof TopMonthDaysSchema>;
