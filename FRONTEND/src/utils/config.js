// we have to all configs for our react frontend here like env variables, constants, etc. so that we can easily manage them in one place

export const ENV = import.meta.env.VITE_ENV_MODE;

export const API_BASE_URL =
  ENV === "development" ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_PROD_API_URL;
