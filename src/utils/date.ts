export const secondsToDays = (seconds: number) => Math.floor(seconds / (60 * 60 * 24));

export const yearsToSeconds = (years: number) => years * 60 * 60 * 24 * 365;

export const secondsToYears = (seconds: number) => seconds / (60 * 60 * 24 * 365);
