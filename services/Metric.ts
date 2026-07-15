import axios from "axios";
import { API_ROUTES } from "@/configs/api.config";
import { axiosClient } from "@/libs/axiosClient.lib";
import {
  TodayAlwaysOut,
  TopEndpoint,
  TopStatusCode,
  TopHour,
  TopWeekday,
  TopWorstEndpoint,
  TopMonthDay,
  TopSlowestEndpoint,
  TopHttpMethod,
  TopDepartment,
  ErrorStatsResponse,
  SuccessStatsResponse,
} from "@/types/metric.type";
import {
  AvgResTimeSchema,
  ErrorStatsResponseSchema,
  SuccessStatsResponseSchema,
  TopDepartmentsSchema,
  TopEndpointsSchema,
  TopHoursSchema,
  TopHttpMethodsSchema,
  TopMonthDaysSchema,
  TopSlowestEndpointsSchema,
  TopStatusCodesSchema,
  TopWorstEndpointsSchema,
  TotalReqsSchema,
  TotalServicesSchema,
  TopWeekdaysSchema,
} from "@/schemas/metric.schema";

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 1,
  delay = 500,
): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status &&
      error.response.status >= 500 &&
      error.response.status < 600 &&
      retries > 0
    ) {
      console.warn(
        `Retrying request after ${delay}ms due to ${error.response.status}`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

class MetricService {
  static async getTotalReqs(): Promise<TodayAlwaysOut<number>> {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.totalReqs()),
      );
      return TotalReqsSchema.parse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Return default empty structure (though backend never returns 404)
        return { hoje: 0, sempre: 0 };
      }
      console.error("Failed to fetch total requisitions:", error);
      throw error;
    }
  }

  static async getAvgResTime(): Promise<TodayAlwaysOut<number>> {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.avgResTime()),
      );
      return AvgResTimeSchema.parse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { hoje: 0, sempre: 0 };
      }
      console.error("Failed to fetch average response time:", error);
      throw error;
    }
  }

  static async getTotalServices(): Promise<TodayAlwaysOut<number>> {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.totalServices()),
      );
      return TotalServicesSchema.parse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { hoje: 0, sempre: 0 };
      }
      console.error("Failed to fetch total services:", error);
      throw error;
    }
  }

  static async getTopEndpoints(): Promise<TodayAlwaysOut<TopEndpoint[]>> {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.topEndpoints()),
      );
      return TopEndpointsSchema.parse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { hoje: [], sempre: [] };
      }
      console.error("Failed to fetch top endpoints:", error);
      throw error;
    }
  }

  static async getTopStatusCodes(): Promise<TodayAlwaysOut<TopStatusCode[]>> {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.topStatusCodes()),
      );
      return TopStatusCodesSchema.parse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { hoje: [], sempre: [] };
      }
      console.error("Failed to fetch top status codes:", error);
      throw error;
    }
  }

  static async getTopHours(): Promise<TodayAlwaysOut<TopHour[]>> {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.topHours()),
      );
      return TopHoursSchema.parse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { hoje: [], sempre: [] };
      }
      console.error("Failed to fetch top hours:", error);
      throw error;
    }
  }

  static async getTopWeekdays(): Promise<TodayAlwaysOut<TopWeekday[]>> {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.topWeekdays()),
      );
      return TopWeekdaysSchema.parse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { hoje: [], sempre: [] };
      }
      console.error("Failed to fetch top weekdays:", error);
      throw error;
    }
  }

  static async getTopWorstEndpoints(): Promise<
    TodayAlwaysOut<TopWorstEndpoint[]>
  > {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.topWorstEndpoints()),
      );
      return TopWorstEndpointsSchema.parse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { hoje: [], sempre: [] };
      }
      console.error("Failed to fetch worst endpoints:", error);
      throw error;
    }
  }

  static async getTopMonthDays(): Promise<TodayAlwaysOut<TopMonthDay[]>> {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.topMonthDays()),
      );
      return TopMonthDaysSchema.parse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { hoje: [], sempre: [] };
      }
      console.error("Failed to fetch top month days:", error);
      throw error;
    }
  }

  static async getTopSlowestEndpoints(): Promise<
    TodayAlwaysOut<TopSlowestEndpoint[]>
  > {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.topSlowestEndpoints()),
      );
      return TopSlowestEndpointsSchema.parse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { hoje: [], sempre: [] };
      }
      console.error("Failed to fetch top slowest endpoints:", error);
      throw error;
    }
  }

  static async getTopHttpMethods(): Promise<TodayAlwaysOut<TopHttpMethod[]>> {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.topHttpMethods()),
      );
      return TopHttpMethodsSchema.parse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { hoje: [], sempre: [] };
      }
      console.error("Failed to fetch top http methods:", error);
      throw error;
    }
  }

  static async getTopDepartments(): Promise<TodayAlwaysOut<TopDepartment[]>> {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.topDepartments()),
      );
      return TopDepartmentsSchema.parse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { hoje: [], sempre: [] };
      }
      console.error("Failed to fetch top http methods:", error);
      throw error;
    }
  }

  static async getSuccessStats(): Promise<SuccessStatsResponse> {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.sucessos()),
      );
      return SuccessStatsResponseSchema.parse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          hoje: { total: 0, percentual: 0 },
          sempre: { total: 0, percentual: 0 },
        };
      }
      console.error("Failed to fetch success stats:", error);
      throw error;
    }
  }

  static async getErrorStats(): Promise<ErrorStatsResponse> {
    try {
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.metric.erros()),
      );
      return ErrorStatsResponseSchema.parse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          hoje: { total: 0, percentual: 0 },
          sempre: { total: 0, percentual: 0 },
        };
      }
      console.error("Failed to fetch error stats:", error);
      throw error;
    }
  }
}

export { MetricService };
