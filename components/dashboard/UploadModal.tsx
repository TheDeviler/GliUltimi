"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import FileDropZone from "@/components/ui/FileDropZone";
import Button from "@/components/ui/Button";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (files: File[]) => void;
  title: string;
  description: string;
}

export default function UploadModal({ isOpen, onClose, onAnalyze, title, description }: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = () => {
    if (files.length === 0) return;
    const uploadedFiles = [...files];
    setFiles([]);
    onAnalyze(uploadedFiles);
  };

  const handleClose = () => {
    setFiles([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm text-slate-500">{description}</p>
        <FileDropZone onFilesChange={setFiles} />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={files.length === 0}>
            Carica e Analizza
          </Button>
        </div>
      </div>
    </Modal>
  );
}
