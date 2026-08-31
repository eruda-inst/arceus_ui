import axios from "axios";
import { API_ROUTES } from "@/configs/api.config";
import { axiosClient } from "@/libs/axiosClient.lib";
import { UserOut, UserPaginationOut, UserIn } from "@/types/user.type";
import { UserOutSchema, UserPaginationOutSchema } from "@/schemas/user.schema";

export default class UserService {
  static async getAll(
    filters: {
      page?: number;
      itemsPerPage?: number;
      name?: string;
      email?: string;
      groupName?: string;
    } = {},
  ): Promise<UserPaginationOut | undefined> {
    try {
      const response = await axiosClient.get(API_ROUTES.user.getAll(filters));

      const data = response.data;
      UserPaginationOutSchema.parse(data);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  static async create(data: UserIn): Promise<UserOut | undefined> {
    try {
      const response = await axiosClient.post(API_ROUTES.user.create(), data);
      const user = response.data;
      UserOutSchema.parse(user);
      return user;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  static async delete(id: number): Promise<void | undefined> {
    try {
      await axiosClient.delete(API_ROUTES.user.deleteById(id));
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  static async toggleStatus(id: number): Promise<UserOut | undefined> {
    try {
      const response = await axiosClient.patch(
        API_ROUTES.user.toggleStatusById(id),
      );
      const user = response.data;
      UserOutSchema.parse(user);
      return user;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  static async updatePasswordById(
    id: number,
    nova_senha: string,
  ): Promise<UserOut | undefined> {
    try {
      const response = await axiosClient.patch(
        API_ROUTES.user.updatePasswordById(id),
        {
          nova_senha,
        },
      );
      const user = response.data;
      UserOutSchema.parse(user);
      return user;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Update password error details:", error.response?.data);
      }
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }
}
