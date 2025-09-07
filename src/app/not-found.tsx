import { Search, Home, Sparkles } from 'lucide-react';
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* App Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#E6EDF3]">AIEdit</h1>
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-[#161B22] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#30363D]">
            <Search className="w-16 h-16 text-[#8B949E]" />
          </div>
          
          <div className="text-8xl font-bold text-[#3B82F6] mb-4 tracking-tight">
            404
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#E6EDF3] mb-3">
            Page Not Found
          </h2>
          <p className="text-[#8B949E] leading-relaxed">
            Looks like this page got lost in the AI transformation process. 
            Let&apos;s get you back to creating amazing edits!
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#30363D]">
          <p className="text-[#8B949E] text-sm">
            Need help? Try uploading an image and describing your desired transformation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;