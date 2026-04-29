import axios from "axios";
import { API_ROUTES } from "@/configs/apiConfig";
import { axiosClient } from "@/libs/axiosClientLib";
import { GroupOut } from "@/types/groupType";
import { GroupOutSchema } from "@/schemas/groupSchema";

class GroupService {
  static async getByName(name: string): Promise<GroupOut | undefined> {
    try {
      const response = await axiosClient.get(API_ROUTES.group.getByName(name), {
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
