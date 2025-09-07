import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface UploadAreaProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  onClear: () => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageUpload, currentImage, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageUpload(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#E6EDF3]">Upload Image</h2>
        {currentImage && (
          <button
            onClick={onClear}
            className="p-2 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#0D1117] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {!currentImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-[#3B82F6] bg-[#3B82F6]/5' 
              : 'border-[#30363D] hover:border-[#3B82F6]/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-[#0D1117] rounded-xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-[#3B82F6]" />
            </div>
            
            <div>
              <p className="text-[#E6EDF3] font-medium mb-1">
                Drop your image here to start ✨
              </p>
              <p className="text-[#8B949E] text-sm mb-4">
                Supports JPG, PNG, GIF up to 10MB
              </p>
              
              <button
                onClick={handleUploadClick}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Browse Files
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative group">
            <img
              src={currentImage}
              alt="Uploaded"
              className="w-full h-64 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <button
                onClick={handleUploadClick}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Change Image
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[#8B949E] text-sm">
            <ImageIcon className="w-4 h-4" />
            <span>Image uploaded successfully</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadArea;