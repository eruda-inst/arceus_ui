import axios from "axios";
import { API_ROUTES } from "@/configs/api.config";
import { axiosClient } from "@/libs/axiosClient.lib";
import { GroupOut } from "@/types/group.type";
import { GroupOutSchema } from "@/schemas/group.schema";

class GroupService {
  static async getById(id: number): Promise<GroupOut | undefined> {
    try {
      const response = await axiosClient.get(API_ROUTES.group.getById(id), {
        withCredentials: false,
      });
      const data = response.data;
      GroupOutSchema.parse(data);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return;
      }
      throw error;
    }
  }

  static async getAll(): Promise<GroupOut[] | undefined> {
    try {
      const response = await axiosClient.get(API_ROUTES.group.getAll(), {
        withCredentials: false,
      });
      const data = response.data;
      GroupOutSchema.array().parse(data);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return;
      }
      throw error;
    }
  }
}

export { GroupService };
