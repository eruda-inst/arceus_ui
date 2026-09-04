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
    const res = await axiosClient.get(API_ROUTES.ixc_user.getAll(filters));
    const data = res.data;
    IXCUserListOutSchema.safeParse(data);
    return data;
  }
}
