/**
 * Toast Notification Hook
 * Replaces alert() with user-friendly notifications
 */

"use client";

import { useState, useCallback } from "react";
import { ApiError } from "@/lib/api/types";
import { createErrorNotification } from "@/lib/utils/errorHandler";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (
      type: ToastType,
      title: string,
      message: string,
      duration: number = 5000
    ) => {
      const id = `toast-${++toastCounter}`;
      const toast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message: string, duration?: number) => {
      return addToast("success", title, message, duration);
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, message: string, duration?: number) => {
      return addToast("error", title, message, duration);
    },
    [addToast]
  );

  const warning = useCallback(
    (title: string, message: string, duration?: number) => {
      return addToast("warning", title, message, duration);
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, message: string, duration?: number) => {
      return addToast("info", title, message, duration);
    },
    [addToast]
  );

  const errorFromApi = useCallback(
    (apiError: ApiError, customMessage?: string) => {
      const notification = createErrorNotification(apiError);
      return addToast(
        notification.type,
        notification.title,
        customMessage || notification.message,
        notification.duration
      );
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    errorFromApi,
  };
}
