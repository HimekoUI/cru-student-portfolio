"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { UploadCloud, FileText, X } from "lucide-react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  onFileSelect?: (file: File | null) => void;
  selectedFile?: File | null;
  helperText?: string;
  className?: string;
}

export function FileUpload({
  label,
  accept = ".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg",
  onFileSelect,
  selectedFile,
  helperText = "รองรับไฟล์ PDF, PPTX, DOCX, PNG, JPG (สูงสุด 10MB)",
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect?.(file);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      {selectedFile ? (
        <div className="flex items-center justify-between rounded-xl border border-primary-200 bg-primary-50/50 p-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg bg-primary-100 p-2 text-primary-600">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFileSelect?.(null)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-error transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-150",
            isDragging
              ? "border-primary-500 bg-primary-50"
              : "border-border bg-muted/30 hover:border-primary-400 hover:bg-muted/60"
          )}
        >
          <UploadCloud className="h-8 w-8 text-primary-500 mb-2" />
          <p className="text-sm font-medium text-foreground">ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์</p>
          <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={(e) => onFileSelect?.(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
