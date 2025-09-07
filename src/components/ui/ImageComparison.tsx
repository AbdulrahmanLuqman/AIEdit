import React from 'react';
import { ArrowRight, Download, AlertCircle } from 'lucide-react';
import Image from "next/image"

interface ImageComparisonProps {
  originalImage: string;
  editedImage?: string;
  status: 'pending' | 'completed' | 'error';
}

const ImageComparison: React.FC<ImageComparisonProps> = ({ 
  originalImage, 
  editedImage, 
  status 
}) => {
  const handleDownload = () => {
    if (editedImage) {
      const link = document.createElement('a');
      link.href = editedImage;
      link.download = 'edited-image.jpg';
      link.click();
    }
  };

  return (
    <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#E6EDF3]">Results</h2>
        {status === 'completed' && editedImage && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 bg-[#0D1117] hover:bg-[#3B82F6] text-[#8B949E] hover:text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Original Image */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#8B949E]">Original</p>
          <div className="relative">
            <div className="w-full h-48">
              <Image
                src={originalImage}
                alt="Original"
                className=" object-cover rounded-lg"
                fill
              />
            </div>
            
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center">
          <ArrowRight className="w-6 h-6 text-[#3B82F6]" />
        </div>

        {/* Edited Image */}
        <div className="space-y-2 md:col-start-2">
          <p className="text-sm font-medium text-[#8B949E]">AI Generated</p>
          <div className="relative">
            {status === 'completed' && editedImage ? (
              <div className="w-full h-48 ">
                <Image
                  src={editedImage}
                  alt="Edited"
                  className="object-cover rounded-lg ring-2 ring-[#3B82F6]/20"
                  fill
                />
              </div>
              
            ) : status === 'error' ? (
              <div className="w-full h-48 bg-[#0D1117] rounded-lg flex items-center justify-center border border-[#30363D]">
                <div className="text-center text-[#F87171]">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Generation failed</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-[#0D1117] rounded-lg flex items-center justify-center border border-[#30363D]">
                <div className="text-center text-[#8B949E]">
                  <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm">AI at work...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;