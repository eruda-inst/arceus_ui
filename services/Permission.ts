import axios from "axios";
import { API_ROUTES } from "@/configs/apiConfig";
import { PermissionOut } from "@/types/permissionType";
import { axiosClient } from "@/libs/axiosClientLib";
import { PermissionOutSchema } from "@/schemas/permissionSchema";

class PermissionService {
  static async getByUserId(userId: number): Promise<PermissionOut[]> {
    try {
      const response = await axiosClient.get(
        API_ROUTES.perm.getByUserId(userId),
      );
      const data = response.data;
      PermissionOutSchema.array().parse(data);
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  }

  static async getByGroupId(groupId: number): Promise<PermissionOut[]> {
    try {
      const response = await axiosClient.get(
        API_ROUTES.perm.getByGroupId(groupId),
      );
      const data = response.data;
      PermissionOutSchema.array().parse(data);
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  }
}

export { PermissionService };
