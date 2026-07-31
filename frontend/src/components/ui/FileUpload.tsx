'use client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export default function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
  });

  if (selectedFile) {
    return (
      <div className="glass-card p-6 border border-primary/30 bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <FileIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-white font-medium">{selectedFile.name}</p>
            <p className="text-sm text-text-secondary">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        <button onClick={() => onFileSelect(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-secondary hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div 
      {...getRootProps()} 
      className={twMerge(
        clsx(
          "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-cards/30 group",
          isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-white/5"
        )
      )}
    >
      <input {...getInputProps()} />
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
        <UploadCloud className="w-8 h-8 text-text-muted group-hover:text-primary" />
      </div>
      <p className="text-xl font-medium text-white mb-2">
        {isDragActive ? "Drop file here..." : "Drag & drop your file here"}
      </p>
      <p className="text-sm text-text-secondary mb-6">or click to browse from your computer</p>
      <div className="flex flex-wrap justify-center gap-2">
        {['PDF', 'DOCX', 'TXT', 'CSV', 'XLSX'].map(ext => (
          <span key={ext} className="px-3 py-1 rounded-md text-xs font-medium bg-white/5 border border-border text-text-muted">
            {ext}
          </span>
        ))}
      </div>
    </div>
  );
}
