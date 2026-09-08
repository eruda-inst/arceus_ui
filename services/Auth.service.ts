import { axiosClient } from "@/libs/axiosClient.lib";
import { API_ROUTES } from "@/configs/api.config";
import { LoginOutSchema } from "@/schemas/auth.schema";
import { UserOutSchema } from "@/schemas/user.schema";
import { UserOutType } from "@/types/user.type";
import { LoginInType, LoginOutType } from "@/types/auth.type";

/**
 * Service class for authentication-related API calls.
 * Handles login and user profile retrieval.
 */
export default class AuthService {
  /**
   * Authenticates a user with email and password.
   * @param creds - Login credentials (email and password)
   * @returns Promise resolving to login response containing tokens
   * @throws Will throw if validation fails or request fails
   */
  static async login(creds: LoginInType): Promise<LoginOutType> {
    const res = await axiosClient.post(API_ROUTES.auth.login(), creds);
    const data = res.data;

    // Validate response shape against the schema
    LoginOutSchema.parse(data);

    return data;
  }

  /**
   * Fetches the current user's profile using an access token.
   * @param accessToken - Bearer token for authorization
   * @returns Promise resolving to the user data
   * @throws Will throw if validation fails or request fails
   */
  static async getMe(accessToken: string): Promise<UserOutType> {
    const res = await axiosClient.get(API_ROUTES.auth.getMe(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = res.data;

    // Validate response shape against the user schema
    UserOutSchema.parse(data);

    return data;
  }
}
