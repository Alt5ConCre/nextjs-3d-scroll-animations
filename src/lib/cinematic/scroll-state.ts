import { useSyncExternalStore } from "react";

export type CinematicScrollRuntime = {
  progress: number;
  velocity: number;
  scroll: number;
  limit: number;
  time: number;
};

let state: CinematicScrollRuntime = {
  progress: 0,
  velocity: 0,
  scroll: 0,
  limit: 0,
  time: 0,
};

const listeners = new Set<() => void>();

export function getCinematicScrollState() {
  return state;
}

export function getServerCinematicScrollState() {
  return state;
}

export function subscribeCinematicScroll(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setCinematicScroll(next: Partial<CinematicScrollRuntime>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

export function useCinematicScroll() {
  return useSyncExternalStore(
    subscribeCinematicScroll,
    getCinematicScrollState,
    getServerCinematicScrollState
  );
}
