import { toast } from "sonner";
import { CheckCircle, XCircle, AlertCircle, Info, Heart, Gift, Calendar, Camera } from "lucide-react";

// Success toast variants
export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    icon: <CheckCircle className="h-4 w-4" />,
    duration: 4000,
  });
};

export const showLoveToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    icon: <Heart className="h-4 w-4 text-pink-500" />,
    duration: 5000,
    className: "border-pink-200 bg-pink-50 text-pink-900",
  });
};

export const showMemoryToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    icon: <Camera className="h-4 w-4 text-blue-500" />,
    duration: 4000,
    className: "border-blue-200 bg-blue-50 text-blue-900",
  });
};

export const showActivityToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    icon: <Calendar className="h-4 w-4 text-green-500" />,
    duration: 4000,
    className: "border-green-200 bg-green-50 text-green-900",
  });
};

export const showJarToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    icon: <Gift className="h-4 w-4 text-purple-500" />,
    duration: 5000,
    className: "border-purple-200 bg-purple-50 text-purple-900",
  });
};

// Error toast variants
export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
    icon: <XCircle className="h-4 w-4" />,
    duration: 6000,
  });
};

// Warning toast
export const showWarningToast = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    icon: <AlertCircle className="h-4 w-4" />,
    duration: 5000,
  });
};

// Info toast
export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, {
    description,
    icon: <Info className="h-4 w-4" />,
    duration: 4000,
  });
};

// Loading toast with promise
export const showLoadingToast = (
  promise: Promise<any>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};

// Custom action toast
export const showActionToast = (
  message: string,
  actionLabel: string,
  onAction: () => void,
  description?: string
) => {
  toast(message, {
    description,
    action: {
      label: actionLabel,
      onClick: onAction,
    },
    duration: 8000,
  });
};