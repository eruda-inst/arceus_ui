import axios from "axios";
import { API_ROUTES } from "@/configs/apiConfig";
import { axiosClient } from "@/libs/axiosClientLib";
import { LogPaginationOut } from "@/types/logType";
import { LogPaginationOutSchema } from "@/schemas/logSchema";

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
      url?: string;
      client?: string;
      domain?: string;
      department?: string;
    } = {},
  ): Promise<LogPaginationOut | undefined> {
    try {
      const response = await axiosClient.get(API_ROUTES.log.getAll(filters), {
        withCredentials: false,
      });
      const data = response.data;
      console.log(data);
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
