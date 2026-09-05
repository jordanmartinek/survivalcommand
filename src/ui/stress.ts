// Stress Mode toggles the utilitarian, high-contrast, larger-text interface
// used during an active emergency.
let stress = false;

export function setStress(on: boolean) {
  stress = on;
  document.body.classList.toggle('stress', on);
}

export function isStress(): boolean {
  return stress;
}
