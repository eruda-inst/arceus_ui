import { useAuthContext } from "@/contexts/authentication.context";

export const useAuthentication = () => {
  return useAuthContext();
};
