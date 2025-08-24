import { createDefine } from "fresh";

export interface State {
 commonData?: {
  pathname: string;
 };
}

export const define = createDefine<State>();
