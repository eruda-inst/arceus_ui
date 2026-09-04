import { API_ROUTES } from "@/configs/api.config";
import { axiosClient } from "@/libs/axiosClient.lib";
import { GroupOutType } from "@/types/group.type";
import { GroupOutSchema } from "@/schemas/group.schema";

export default class GroupService {
  static async getById(id: number): Promise<GroupOutType | undefined> {
    const response = await axiosClient.get(API_ROUTES.group.getById(id), {
      withCredentials: false,
    });
    const data = response.data;
    GroupOutSchema.parse(data);
    return data;
  }

  static async getAll(): Promise<GroupOutType[] | undefined> {
    const response = await axiosClient.get(API_ROUTES.group.getAll(), {
      withCredentials: false,
    });
    const data = response.data;
    const groups = data.data;
    GroupOutSchema.array().parse(groups);
    return groups;
  }
}
