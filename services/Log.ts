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
      method?: string;
      endpoint?: string;
      code?: number;
      data_inicio?: string;
      data_fim?: string;
      hora_inicio?: string;
      hora_fim?: string;
      protocol?: string;
      department?: string;
      nome_cliente?: string;
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
