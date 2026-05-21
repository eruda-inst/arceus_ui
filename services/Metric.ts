import axios from "axios";
import { API_ROUTES } from "@/configs/apiConfig";
import { axiosClient } from "@/libs/axiosClientLib";

// Usar validação de schema e tipagem apropriada (no Promise) depois. Seguir Articuno.

class MetricService {
  static async getTotalReqs(): Promise<any> {
    try {
      const response = await axiosClient.get(API_ROUTES.metric.totalReqs());
      const data = response.data;
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  }

  static async getAvgResTime(): Promise<any> {
    try {
      const response = await axiosClient.get(API_ROUTES.metric.avgResTime());
      const data = response.data;
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  }

  static async getSuccessRate(): Promise<any> {
    try {
      const response = await axiosClient.get(API_ROUTES.metric.successRate());
      const data = response.data;
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  }

  static async getErrorRate(): Promise<any> {
    try {
      const response = await axiosClient.get(API_ROUTES.metric.errorRate());
      const data = response.data;
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  }

  static async getTotalErrors(): Promise<any> {
    try {
      const response = await axiosClient.get(API_ROUTES.metric.totalErrors());
      const data = response.data;
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  }

  static async getTotalSuccesses(): Promise<any> {
    try {
      const response = await axiosClient.get(
        API_ROUTES.metric.totalSuccesses(),
      );
      const data = response.data;
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  }

  static async getTotalServices(): Promise<any> {
    try {
      const response = await axiosClient.get(API_ROUTES.metric.totalServices());
      const data = response.data;
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  }

  static async getTopEndpoints(): Promise<any> {
    try {
      const response = await axiosClient.get(API_ROUTES.metric.topEndpoints());
      const data = response.data;
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  }

  static async getTopStatusCodes(): Promise<any> {
    try {
      const response = await axiosClient.get(
        API_ROUTES.metric.topStatusCodes(),
      );
      const data = response.data;
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  }

  static async getTopHours(): Promise<any> {
    try {
      const response = await axiosClient.get(API_ROUTES.metric.topHours());
      const data = response.data;
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  }

  static async getTopWeekdays(): Promise<any> {
    try {
      const response = await axiosClient.get(API_ROUTES.metric.topWeekdays());
      const data = response.data;
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  }

  static async getTopWorstEndpoints(): Promise<any> {
    try {
      const response = await axiosClient.get(
        API_ROUTES.metric.topWorstEndpoints(),
      );
      const data = response.data;
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  }

  static async getTopMonthDays(): Promise<any> {
    try {
      const response = await axiosClient.get(API_ROUTES.metric.topMonthDays());
      const data = response.data;
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return {};
      }
      throw err;
    }
  }
}

export { MetricService };
