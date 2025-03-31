import { useContext } from "react";
import { ModuleState, ModuleContext } from "@/store/moduleStore";

export type ModuleStateType = ModuleState;

export const useModuleSystem = () => {
  const context = useContext(ModuleContext);
  return context;
};