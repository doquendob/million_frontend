/**
 * Toast Container Component
 * Displays toast notifications
 */

'use client';

import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { Toast as ToastType } from '@/hooks/useToast';

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        const bgColor = colorMap[toast.type];

        return (
          <div
            key={toast.id}
            className="bg-white rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right"
          >
            <div className={`${bgColor} p-2 rounded-full text-white shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900">{toast.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              aria-label="Close notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
