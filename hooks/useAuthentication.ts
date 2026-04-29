// hooks/useAuthentication.ts
import { useAuthContext } from "@/contexts/authenticationContext";

export const useAuthentication = () => {
  return useAuthContext();
};
