import { useContext } from "react";
import { AuthState, AuthContext } from "@/store/authStore";

export type AuthStateType = AuthState;

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
