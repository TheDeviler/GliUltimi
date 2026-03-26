"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropZoneProps {
  onFilesChange: (files: File[]) => void;
  acceptedTypes?: string;
  label?: string;
  maxFiles?: number;
}

export default function FileDropZone({
  onFilesChange,
  acceptedTypes = ".pdf,.doc,.docx,.xlsx,.csv",
  label = "Trascina i file qui o clicca per selezionare",
  maxFiles = 5,
}: FileDropZoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const combined = [...files, ...Array.from(newFiles)].slice(0, maxFiles);
    setFiles(combined);
    onFilesChange(combined);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div>
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer",
          isDragging
            ? "border-emerald-500 bg-emerald-50"
            : "border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/50"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mb-3 h-10 w-10 text-slate-400" />
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="mt-1 text-xs text-slate-400">PDF, DOC, XLSX, CSV — Max {maxFiles} file</p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes}
          multiple
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="flex-1 truncate text-sm text-slate-700">{file.name}</span>
              <span className="text-xs text-slate-400">{formatSize(file.size)}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="rounded p-0.5 text-slate-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
