"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles = {
  info: "bg-info-light/60 border-info/30 text-blue-900",
  success: "bg-success-light/60 border-success/30 text-green-900",
  warning: "bg-warning-light/60 border-warning/30 text-amber-900",
  error: "bg-error-light/60 border-error/30 text-red-900",
};

const variantIcons = {
  info: <Info className="h-5 w-5 text-info shrink-0" />,
  success: <CheckCircle2 className="h-5 w-5 text-success shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning shrink-0" />,
  error: <AlertCircle className="h-5 w-5 text-error shrink-0" />,
};

export function Alert({ variant = "info", title, children, dismissible, onDismiss, className }: AlertProps) {
  return (
    <div className={cn("flex items-start gap-3 rounded-xl border p-4", variantStyles[variant], className)} role="alert">
      {variantIcons[variant]}
      <div className="flex-1 text-sm">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <div className="opacity-90">{children}</div>
      </div>
      {dismissible && onDismiss && (
        <button onClick={onDismiss} className="opacity-70 hover:opacity-100 cursor-pointer">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
