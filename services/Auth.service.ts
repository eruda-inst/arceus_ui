import { axiosClient } from "@/libs/axiosClient.lib";
import { API_ROUTES } from "@/configs/api.config";
import { UserOutType } from "@/types/user.type";

export default class AuthenticationService {
  static async getMe(accessToken: string) {
    const response = await axiosClient.get<UserOutType>(
      API_ROUTES.authentication.getMe(),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  }
}
