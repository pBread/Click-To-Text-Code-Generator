import type { Dispatch, SetStateAction } from "react";

export interface State {
  text: string;
  toNumber: string;
}

export type SetState = Dispatch<SetStateAction<State>>;

export function makeLink(state: State) {
  return `SMSTO://${state.toNumber}&body=${state.text}`.replace(/ /g, "%20");
}
