export const reducedMotion = () =>
  new URLSearchParams(window.location.search).has('preview') ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
