/** How long each orders node waits before it answers, so a run can be watched on the canvas. */
let pace = 450;

/** Sets the wait in milliseconds. Tests set 0. */
export function setPace(ms: number): void {
  pace = ms;
}

export function pause(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, pace));
}
