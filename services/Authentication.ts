import { axiosClient } from "@/libs/axiosClientLib";
import { API_ROUTES } from "@/configs/apiConfig";
import { UserOut } from "@/types/userType";

class AuthenticationService {
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

export { AuthenticationService };
