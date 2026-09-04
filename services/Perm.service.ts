import { API_ROUTES } from "@/configs/api.config";
import { PermOutType } from "@/types/perm.type";
import { axiosClient } from "@/libs/axiosClient.lib";
import { PermOutSchema } from "@/schemas/perm.schema";

export default class PermService {
  static async getByUserId(userId: number): Promise<PermOutType[]> {
    const res = await axiosClient.get(API_ROUTES.perm.getByUserId(userId));
    const data = res.data;
    const perms = data.data;
    PermOutSchema.array().parse(perms);
    return perms;
  }
}
