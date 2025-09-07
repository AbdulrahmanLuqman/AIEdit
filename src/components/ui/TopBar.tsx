"use client"

import { useState } from 'react';
// import Image from 'next/image';
import { Sparkles, History, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

// interface TopBarProps {
//   user: User;
// }

const TopBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#161B22] border-b border-[#30363D] z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#E6EDF3]">AIEdit</h1>
        </Link>

        {/* Navigation & User Menu */}
        <div className="flex items-center gap-4">
          <Link
            href="/history"
            className="flex items-center gap-2 px-3 py-2 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#0D1117] rounded-lg transition-colors"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </Link>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 hover:bg-[#0D1117] rounded-lg transition-colors"
            >
              {/* {user.avatar ? (
                <Image 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : ( */}
                <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
              {/* )} */}
              <span className="hidden sm:inline text-[#E6EDF3] font-medium">CodeKage</span>
            </button>

            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#161B22] border border-[#30363D] rounded-lg shadow-xl z-20">
                  <div className="p-3 border-b border-[#30363D]">
                    <p className="font-medium text-[#E6EDF3]">CodeKage</p>
                    <p className="text-sm text-[#8B949E]">luqmanola60@gmail.com</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[#8B949E] hover:text-[#F87171] hover:bg-[#0D1117] rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;