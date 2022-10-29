export const currencies = ["BTC", "EUR", "JPY", "USD"] as const;
export type Currency = typeof currencies[number];
export type Point2d = { x: number; y: number };
