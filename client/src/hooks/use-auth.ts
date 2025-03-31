import { AuthState, useAuth as useAuthStore } from "@/store/authStore";

export type AuthStateType = AuthState;

export const useAuth = useAuthStore;
