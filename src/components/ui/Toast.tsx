import { Toaster, toast, type ToastOptions } from "react-hot-toast";

const baseToastOptions: ToastOptions = {
  duration: 4000,
  style: {
    background: "#1a1a1a",
    color: "#e2e2e2",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
  },
};

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        ...baseToastOptions,
        success: {
          iconTheme: { primary: "#4be277", secondary: "#000000" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
        },
      }}
    />
  );
}

export const toastSuccess = (message: string) =>
  toast.success(message, {
    ...baseToastOptions,
    iconTheme: { primary: "#4be277", secondary: "#000000" },
  });

export const toastError = (message: string) =>
  toast.error(message, {
    ...baseToastOptions,
    iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
  });

export const toastLoading = (message: string) =>
  toast.loading(message, baseToastOptions);

export const toastDismiss = (id?: string) => {
  toast.dismiss(id);
};
