import {
  TopEndpointSchema,
  TopStatusCodeSchema,
  TopHourSchema,
  TopWeekdaySchema,
  TopWorstEndpointSchema,
  TopMonthDaySchema,
  TotalReqsSchema,
  ResTimeSchema,
  TotalServicesSchema,
  TopEndpointsSchema,
  TopStatusCodesSchema,
  TopHoursSchema,
  TopWeekdaysSchema,
  TopWorstEndpointsSchema,
  TopMonthDaysSchema,
  TopSlowestEndpointSchema,
  TopSlowestEndpointsSchema,
  TopHttpMethodSchema,
  TopHttpMethodsSchema,
  TopDepartmentSchema,
  TopDepartmentsSchema,
  SuccessStatsSchema,
  ErrorStatsSchema,
  SuccessStatsResponseSchema,
  ErrorStatsResponseSchema,
  ResponseTimeStatsSchema,
} from "@/schemas/metric.schema";
import type z from "zod";

export type TopEndpoint = z.infer<typeof TopEndpointSchema>;
export type TopStatusCode = z.infer<typeof TopStatusCodeSchema>;
export type TopHour = z.infer<typeof TopHourSchema>;
export type TopWeekday = z.infer<typeof TopWeekdaySchema>;
export type TopWorstEndpoint = z.infer<typeof TopWorstEndpointSchema>;
export type TopMonthDay = z.infer<typeof TopMonthDaySchema>;
export type TopSlowestEndpoint = z.infer<typeof TopSlowestEndpointSchema>;
export type TopHttpMethod = z.infer<typeof TopHttpMethodSchema>;
export type TopDepartment = z.infer<typeof TopDepartmentSchema>;
export interface TodayAlwaysOut<T> {
  hoje: T;
  sempre: T;
}
export interface TopHourFormatted {
  hora: string; // ex: "13 h"
  total_requisicoes: number;
}
export type TotalReqs = z.infer<typeof TotalReqsSchema>;
export type TotalServices = z.infer<typeof TotalServicesSchema>;
export type TopEndpoints = z.infer<typeof TopEndpointsSchema>;
export type TopStatusCodes = z.infer<typeof TopStatusCodesSchema>;
export type TopHours = z.infer<typeof TopHoursSchema>;
export type TopWeekdays = z.infer<typeof TopWeekdaysSchema>;
export type TopWorstEndpoints = z.infer<typeof TopWorstEndpointsSchema>;
export type TopMonthDays = z.infer<typeof TopMonthDaysSchema>;
export type TopSlowestEndpoints = z.infer<typeof TopSlowestEndpointsSchema>;
export type TopHttpMethods = z.infer<typeof TopHttpMethodsSchema>;
export type TopDepartments = z.infer<typeof TopDepartmentsSchema>;
export type SuccessStats = z.infer<typeof SuccessStatsSchema>;
export type ErrorStats = z.infer<typeof ErrorStatsSchema>;
export type SuccessStatsResponse = z.infer<typeof SuccessStatsResponseSchema>;
export type ErrorStatsResponse = z.infer<typeof ErrorStatsResponseSchema>;
export type ResponseTimeStats = z.infer<typeof ResponseTimeStatsSchema>;
export type AvgResTime = z.infer<typeof ResTimeSchema>;
