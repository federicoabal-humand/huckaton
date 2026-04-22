"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image, Film } from "lucide-react";
import { useLanguage } from "@/lib/hureport/language-context";
import { t } from "@/lib/hureport/translations";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function FileUpload({ files, onChange }: FileUploadProps) {
  const { language } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );
    
    onChange([...files, ...droppedFiles]);
  }, [files, onChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onChange([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const getPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors duration-150 ease-out",
          isDragging
            ? "border-[#2563EB] bg-[#DBEAFE]"
            : "border-[#D1D5DB] hover:border-[#2563EB]/50 hover:bg-[#F9FAFB]"
        )}
      >
        <Upload className={cn("h-8 w-8", isDragging ? "text-[#2563EB]" : "text-[#9CA3AF]")} />
        <div className="text-center">
          <p className="text-sm font-medium text-[#374151]">
            {t("dropFiles", language)}
          </p>
          <p className="text-xs text-[#6B7280]">
            {t("orBrowse", language)}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, index) => (
            <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]">
              {file.type.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getPreviewUrl(file)}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Film className="h-8 w-8 text-[#9CA3AF]" />
                </div>
              )}
              
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute right-1 top-1 rounded-full bg-[#111827]/80 p-1 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100"
              >
                <X className="h-3 w-3 text-white" />
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                <div className="flex items-center gap-1">
                  {file.type.startsWith("image/") ? (
                    <Image className="h-3 w-3 text-white" />
                  ) : (
                    <Film className="h-3 w-3 text-white" />
                  )}
                  <span className="truncate text-xs text-white">{file.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
