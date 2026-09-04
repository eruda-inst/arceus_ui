import { axiosClient } from "@/libs/axiosClient.lib";
import { API_ROUTES } from "@/configs/api.config";
import { UserOutType } from "@/types/user.type";

export default class AuthService {
  static async getMe(accessToken: string) {
    const res = await axiosClient.get<UserOutType>(API_ROUTES.auth.getMe(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  }
}
