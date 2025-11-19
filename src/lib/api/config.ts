// API Configuration

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
};

export const API_ENDPOINTS = {
  properties: "/properties",
  categories: "/categories",
  upload: "/upload/image",
};
