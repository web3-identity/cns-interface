export const yearsToSeconds = (years: number) => years * 60 * 60 * (import.meta.env.VITE_RegisterUnit === '小时' ? 1 : (24 * 365));
