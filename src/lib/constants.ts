export const SITE_NAME = "Trade Lynk"
export const SITE_DESCRIPTION = "Your trusted platform for trading and investment"
export const SITE_URL = "https://tradelynk.com"

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
] as const

export const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "EST", label: "Eastern Time (EST)" },
  { value: "PST", label: "Pacific Time (PST)" },
  { value: "GMT", label: "Greenwich Mean Time (GMT)" },
] as const

export const TRADING_VIEWS = [
  { value: "basic", label: "Basic" },
  { value: "advanced", label: "Advanced" },
  { value: "professional", label: "Professional" },
] as const

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const SUPPORTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
] as const

export const DEFAULT_AVATAR = "/avatars/default.png"

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  USER: {
    PROFILE: "/api/user/profile",
    SETTINGS: "/api/user/settings",
    AVATAR: "/api/user/avatar",
  },
  TRADING: {
    ORDERS: "/api/trading/orders",
    POSITIONS: "/api/trading/positions",
    HISTORY: "/api/trading/history",
  },
} as const

export const ROUTES = {
  HOME: "/",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  DASHBOARD: "/dashboard",
  TRADING: "/trading",
  MARKETS: "/markets",
  WALLET: "/wallet",
  P2P: "/p2p",
} as const

export const ERROR_MESSAGES = {
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PASSWORD: "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number",
  REQUIRED_FIELD: "This field is required",
  FILE_TOO_LARGE: "File size must be less than 5MB",
  INVALID_FILE_TYPE: "File type not supported",
  NETWORK_ERROR: "Network error. Please try again",
  UNKNOWN_ERROR: "An unknown error occurred",
} as const

export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: "Profile updated successfully",
  SETTINGS_UPDATED: "Settings updated successfully",
  AVATAR_UPDATED: "Avatar updated successfully",
  PASSWORD_CHANGED: "Password changed successfully",
} as const

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const 