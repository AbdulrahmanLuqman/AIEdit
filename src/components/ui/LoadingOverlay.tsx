import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#0D1117]/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-8 text-center max-w-sm mx-4">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-[#E6EDF3] mb-2">
          AI is working its magic ✨
        </h3>
        <p className="text-[#8B949E] text-sm">
          Creating your transformation... This may take a few moments.
        </p>
        
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#8B949E]">
          <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;