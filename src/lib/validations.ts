import { z } from "zod"
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE } from "./constants"

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
  avatar: z
    .string()
    .url("Invalid avatar URL")
    .optional(),
})

export const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  tradingNotifications: z.boolean(),
  twoFactorAuth: z.boolean(),
  darkMode: z.boolean(),
  language: z.enum(["en", "es", "fr", "de"]),
  timezone: z.enum(["UTC", "EST", "PST", "GMT"]),
  tradingView: z.enum(["basic", "advanced", "professional"]),
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const avatarUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
    .refine(
      (file) => SUPPORTED_FILE_TYPES.includes(file.type as any),
      "File type not supported"
    ),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type SettingsFormData = z.infer<typeof settingsSchema>
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>
export type AvatarUploadFormData = z.infer<typeof avatarUploadSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema> 