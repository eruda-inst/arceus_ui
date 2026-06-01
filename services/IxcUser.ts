import axios from "axios";
import { API_ROUTES } from "@/configs/api.config";
import { axiosClient } from "@/libs/axiosClient.lib";
import { IXCUserPaginationOut, IXCUserOut } from "@/types/ixcUser.type";
import {
  IXCUserPaginationOutSchema,
  IXCUserOutSchema,
} from "@/schemas/ixcUser.schema";

class IxcUserService {
  static async getAll(
    filters: {
      page?: number;
      itemsPerPage?: number;
      name?: string;
      email?: string;
    } = {},
  ): Promise<IXCUserPaginationOut | undefined> {
    try {
      const response = await axiosClient.get(
        API_ROUTES.ixc_user.getAll(filters),
      );
      const data = response.data;
      IXCUserPaginationOutSchema.parse(data);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  static async getByEmail(email: string): Promise<IXCUserOut | undefined> {
    try {
      const response = await axiosClient.get(
        API_ROUTES.ixc_user.getByEmail(email),
      );
      const data = response.data;
      IXCUserOutSchema.parse(data);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }
}

export { IxcUserService };
