import { useContext } from "react";
import { ThemeState, ThemeContext } from "@/store/themeStore";

export type ThemeStateType = ThemeState;

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};
