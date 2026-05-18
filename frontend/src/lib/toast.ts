import { toast as sonnerToast, type ExternalToast } from "sonner";

/** App-wide toast API (Sonner). Use instead of `alert()` or inline alert boxes. */
export const toast = {
  success: (message: string, data?: ExternalToast) => sonnerToast.success(message, data),
  error: (message: string, data?: ExternalToast) => sonnerToast.error(message, data),
  info: (message: string, data?: ExternalToast) => sonnerToast.info(message, data),
  warning: (message: string, data?: ExternalToast) => sonnerToast.warning(message, data),
  message: (message: string, data?: ExternalToast) => sonnerToast.message(message, data),
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss
};
