"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image, Film, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/hureport/language-context";
import { t } from "@/lib/hureport/translations";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_FILES = 5;

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/mov", "video/quicktime", "video/webm"];
const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function FileUpload({ files, onChange }: FileUploadProps) {
  const { language } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((newFiles: File[]): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const fileErrors: string[] = [];

    // Check max files limit
    const totalFiles = files.length + newFiles.length;
    if (totalFiles > MAX_FILES) {
      fileErrors.push(
        language === "es"
          ? `Maximo ${MAX_FILES} archivos permitidos`
          : `Maximum ${MAX_FILES} files allowed`
      );
      return { valid: [], errors: fileErrors };
    }

    for (const file of newFiles) {
      // Check file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        fileErrors.push(
          language === "es"
            ? `"${file.name}" no es un tipo de archivo valido`
            : `"${file.name}" is not a valid file type`
        );
        continue;
      }

      // Check file size
      const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
      
      if (file.size > maxSize) {
        const maxSizeFormatted = formatFileSize(maxSize);
        fileErrors.push(
          language === "es"
            ? `"${file.name}" excede el limite de ${maxSizeFormatted}`
            : `"${file.name}" exceeds ${maxSizeFormatted} limit`
        );
        continue;
      }

      validFiles.push(file);
    }

    return { valid: validFiles, errors: fileErrors };
  }, [files.length, language]);

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
    setErrors([]);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const { valid, errors: fileErrors } = validateFiles(droppedFiles);
    
    if (fileErrors.length > 0) {
      setErrors(fileErrors);
    }
    
    if (valid.length > 0) {
      onChange([...files, ...valid]);
    }
  }, [files, onChange, validateFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors([]);
    
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const { valid, errors: fileErrors } = validateFiles(selectedFiles);
      
      if (fileErrors.length > 0) {
        setErrors(fileErrors);
      }
      
      if (valid.length > 0) {
        onChange([...files, ...valid]);
      }
    }
    
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
    setErrors([]);
  };

  const getPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  const acceptString = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(",");

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
          <p className="mt-1 text-xs text-[#9CA3AF]">
            {language === "es" 
              ? "Imagenes hasta 5MB, videos hasta 25MB" 
              : "Images up to 5MB, videos up to 25MB"}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={acceptString}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-[#DC2626]">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

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
