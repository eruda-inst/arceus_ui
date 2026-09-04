import axios from "axios";
import { API_ROUTES } from "@/configs/api.config";
import { axiosClient } from "@/libs/axiosClient.lib";
import { IXCUserListOutType } from "@/types/ixcUser.type";
import { IXCUserListOutSchema } from "@/schemas/ixcUser.schema";

export default class IxcUserService {
  static async getAll(
    filters: {
      page?: number;
      itemsPerPage?: number;
      name?: string;
      email?: string;
    } = {},
  ): Promise<IXCUserListOutType | undefined> {
    try {
      const response = await axiosClient.get(
        API_ROUTES.ixc_user.getAll(filters),
      );
      const data = response.data;
      IXCUserListOutSchema.safeParse(data);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }
}
