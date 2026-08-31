import axios from "axios";
import { API_ROUTES } from "@/configs/api.config";
import { PermOut } from "@/types/perm.type";
import { axiosClient } from "@/libs/axiosClient.lib";
import { PermOutSchema } from "@/schemas/perm.schema";

export default class PermService {
  static async getByUserId(userId: number): Promise<PermOut[]> {
    try {
      const response = await axiosClient.get(
        API_ROUTES.perm.getByUserId(userId),
      );
      const data = response.data;
      const perms = data.data;
      PermOutSchema.array().parse(perms);
      return perms;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  }
}
