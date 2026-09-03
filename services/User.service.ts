import axios from "axios";
import { API_ROUTES } from "@/configs/api.config";
import { axiosClient } from "@/libs/axiosClient.lib";
import { UserOut, UserIn } from "@/types/user.type";
import { UserOutSchema } from "@/schemas/user.schema";

export default class UserService {
  static async create(data: UserIn): Promise<UserOut | undefined> {
    const response = await axiosClient.post(API_ROUTES.user.create(), data);
    const user = response.data;
    UserOutSchema.parse(user);
    return user;
  }

  static async delete(id: number): Promise<void | undefined> {
    await axiosClient.delete(API_ROUTES.user.deleteById(id));
  }

  static async toggleStatus(id: number): Promise<UserOut | undefined> {
    const response = await axiosClient.patch(
      API_ROUTES.user.toggleStatusById(id),
    );
    const user = response.data;
    UserOutSchema.parse(user);
    return user;
  }

  static async updatePasswordById(
    id: number,
    nova_senha: string,
  ): Promise<UserOut | undefined> {
    const response = await axiosClient.patch(
      API_ROUTES.user.updatePasswordById(id),
      { nova_senha },
    );
    const user = response.data;
    UserOutSchema.parse(user);
    return user;
  }
}
