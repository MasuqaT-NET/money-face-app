export const currencySigns = ["BTC", "EUR", "JPY", "USD"] as const;
export type CurrencySign = typeof currencySigns[number];
export type Point2d = { x: number; y: number };
