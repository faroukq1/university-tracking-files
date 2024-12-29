import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn } from "../../lib/utils";

export const Toast = ToastPrimitive.Root;
export const ToastTitle = ToastPrimitive.Title;
export const ToastDescription = ToastPrimitive.Description;
export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = ToastPrimitive.Viewport;

export const CustomToast = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Toast
    className={cn(
      "relative bg-gray-50 text-neutral-900 p-4 px-10 rounded-md shadow-md"
    )}
  >
    <ToastTitle className="font-bold">{title}</ToastTitle>
    <ToastDescription className="text-sm mt-1">{description}</ToastDescription>
  </Toast>
);
