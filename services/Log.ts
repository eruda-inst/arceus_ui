import axios from "axios";
import { API_ROUTES } from "@/configs/api.config";
import { axiosClient } from "@/libs/axiosClient.lib";
import { LogPaginationOut } from "@/types/log.type";
import { LogPaginationOutSchema } from "@/schemas/log.schema";

class LogService {
  static async getAll(
    filters: {
      page?: number;
      itemsPerPage?: number;
      ip?: string;
      method?: string;
      endpoint?: string;
      code?: string;
      data_inicio?: string;
      data_fim?: string;
      hora_inicio?: string;
      hora_fim?: string;
      duration?: number;
      protocol?: string;
      payload?: string;
      response?: string;
      url?: string;
      client?: string;
      domain?: string;
      department?: string;
    } = {},
  ): Promise<LogPaginationOut | undefined> {
    try {
      const response = await axiosClient.get(API_ROUTES.log.getAll(filters), {
        withCredentials: true,
      });
      const data = response.data;
      LogPaginationOutSchema.parse(data);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return;
      }
      throw error;
    }
  }
}

export { LogService };
