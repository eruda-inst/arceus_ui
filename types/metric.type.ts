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
  TopErrorRateEndpointSchema,
} from "@/schemas/metric.schema";
import type z from "zod";

type ErrorStatsType = z.infer<typeof ErrorStatsSchema>;

type SuccessStatsType = z.infer<typeof SuccessStatsSchema>;

interface TodayAlwaysOutType<T> {
  hoje: T;
  sempre: T;
}

type TopClientType = z.infer<typeof TopClientSchema>;

type TopDepartmentType = z.infer<typeof TopDepartmentSchema>;

type TopEndpointType = z.infer<typeof TopEndpointSchema>;

type TopHourType = z.infer<typeof TopHourSchema>;

interface TopHourFormattedType {
  hora: string;
  total_requisicoes: number;
}

type TopHttpMethodType = z.infer<typeof TopHttpMethodSchema>;

type TopMonthDayType = z.infer<typeof TopMonthDaySchema>;

type TopSlowestEndpointType = z.infer<typeof TopSlowestEndpointSchema>;

type TopStatusCodeType = z.infer<typeof TopStatusCodeSchema>;

type TopWeekdayType = z.infer<typeof TopWeekdaySchema>;

type TopWorstEndpointType = z.infer<typeof TopWorstEndpointSchema>;

type TopErrorRateEndpointType = z.infer<typeof TopErrorRateEndpointSchema>;

export type {
  ErrorStatsType,
  SuccessStatsType,
  TodayAlwaysOutType,
  TopClientType,
  TopDepartmentType,
  TopEndpointType,
  TopHourType,
  TopHourFormattedType,
  TopHttpMethodType,
  TopMonthDayType,
  TopSlowestEndpointType,
  TopStatusCodeType,
  TopWeekdayType,
  TopWorstEndpointType,
  TopErrorRateEndpointType,
};
