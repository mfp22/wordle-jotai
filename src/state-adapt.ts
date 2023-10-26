import { configureStateAdapt } from "@state-adapt/rxjs";

export const stateadapt = configureStateAdapt();
export const { adapt, watch } = stateadapt;
