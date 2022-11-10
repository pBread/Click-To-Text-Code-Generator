export const isDev = process.env.NODE_ENV === "development";
export const isServer = typeof window === "undefined";

export const origin = isDev
  ? `http://localhost:${process.env.PORT || 3000}`
  : `https://${process.env.NEXT_PUBLIC_DOMAIN}`;
