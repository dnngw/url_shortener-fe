import { z } from "zod";

/*
* Validation rules, follow the backend validator
* (UserValidator, ShortCodeValidator, UrlValidator)
* */

// Same as backend: only http/https, must have host, max 2048 chars
function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && !!url.hostname;
  } catch {
    return false;
  }
}

const username = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]{5,50}$/, "Username must be 5-50 characters, letters or numbers only");

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((value) => new TextEncoder().encode(value).length <= 72, "Password is too long");

export const originalUrl = z
  .string()
  .trim()
  .min(1, "URL is required")
  .max(2048, "URL is too long (max. 2048 characters)")
  .refine(isHttpUrl, "URL must start with http:// or https://");

const shortCode = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^[a-z0-9][a-z0-9_-]{2,18}[a-z0-9]$/,
    "4-20 characters: letters, numbers, - or _. First and last character must be a letter or number"
  );

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    username,
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const createLinkSchema = z.object({
  shortCode,
  originalUrl,
});

export const updateLinkSchema = z.object({
  originalUrl,
});

export const qrSchema = z.object({
  url: originalUrl,
});
