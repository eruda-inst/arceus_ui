import axios from "axios";
import { API_ROUTES } from "@/configs/apiConfig";
import { axiosClient } from "@/libs/axiosClientLib";
import { UserOut, UserPaginationOut, UserUpdate } from "@/types/userType";
import { UserOutSchema, UserPaginationOutSchema } from "@/schemas/userSchema";

// Helper: retry automático para erros 5xx
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 1,
  delay = 500,
): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status &&
      error.response.status >= 500 &&
      error.response.status < 600 &&
      retries > 0
    ) {
      console.warn(
        `Retrying request after ${delay}ms due to ${error.response.status}`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

class UserService {
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
      const response = await withRetry(() =>
        axiosClient.get(API_ROUTES.user.getAll(filters)),
      );
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

  static async create(data: UserUpdate): Promise<UserOut | undefined> {
    try {
      const response = await withRetry(() =>
        axiosClient.post(API_ROUTES.user.create(), data),
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

  static async update(
    id: number,
    data: UserUpdate,
  ): Promise<UserOut | undefined> {
    try {
      const response = await withRetry(() =>
        axiosClient.put(API_ROUTES.user.updateById(id), data),
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

  static async delete(id: number): Promise<void | undefined> {
    try {
      await withRetry(() => axiosClient.delete(API_ROUTES.user.deleteById(id)));
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  static async inactivate(id: number): Promise<UserOut | undefined> {
    try {
      const response = await withRetry(() =>
        axiosClient.patch(API_ROUTES.user.inactivateById(id)),
      );
      const user = response.data;
      UserOutSchema.parse(user);
      return user;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Inactivate error details:", error.response?.data);
      }
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  static async reactivate(id: number): Promise<UserOut | undefined> {
    try {
      const response = await withRetry(() =>
        axiosClient.patch(API_ROUTES.user.reactivateById(id)),
      );
      const user = response.data;
      UserOutSchema.parse(user);
      return user;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Reactivate error details:", error.response?.data);
      }
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }
}

export { UserService };
