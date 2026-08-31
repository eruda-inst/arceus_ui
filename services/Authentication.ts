import { axiosClient } from "@/libs/axiosClient.lib";
import { API_ROUTES } from "@/configs/api.config";
import { UserOut } from "@/types/user.type";

export default class AuthenticationService {
  static async getMe(accessToken: string) {
    try {
      const response = await axiosClient.get<UserOut>(
        API_ROUTES.authentication.getMe(),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}
