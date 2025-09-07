"use client"

import { useState, useEffect } from 'react';
import { ImageEdit } from '@/types/definitions';
import TopBar from '@/components/ui/TopBar';
import { Calendar, Search, Download, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const History = () => {
  const [history, setHistory] = useState<ImageEdit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState<ImageEdit[]>([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('imageHistory') || '[]');
    setHistory(savedHistory);
    setFilteredHistory(savedHistory);
  }, []);

  useEffect(() => {
    const filtered = history.filter(edit => 
      edit.prompt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(filtered);
  }, [searchTerm, history]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `edited-${prompt.slice(0, 20).replace(/\s+/g, '-')}.jpg`;
    link.click();
  };

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter(edit => edit.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('imageHistory', JSON.stringify(updatedHistory));
  };

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <TopBar />
      
      <div className="pt-16 px-4 pb-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#E6EDF3] mb-2">Edit History</h1>
            <p className="text-[#8B949E]">Browse your previous AI transformations</p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B949E]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by prompt..."
                className="w-full pl-10 pr-4 py-2 bg-[#161B22] border border-[#30363D] rounded-lg text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* History Grid */}
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#161B22] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-[#8B949E]" />
              </div>
              <h3 className="text-lg font-semibold text-[#E6EDF3] mb-2">
                {history.length === 0 ? 'No edits yet' : 'No matching results'}
              </h3>
              <p className="text-[#8B949E] mb-6">
                {history.length === 0 
                  ? 'Start creating amazing AI transformations!' 
                  : 'Try adjusting your search terms'
                }
              </p>
              {history.length === 0 && (
                <Link
                  href='/'
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Create First Edit
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredHistory.map((edit) => (
                <div key={edit.id} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden group">
                  <div className="relative">
                    {/* Before/After Images */}
                    <div className="aspect-video bg-[#0D1117] flex">
                      <div className="w-1/2 relative overflow-hidden">
                        <Image
                          src={edit.originalImage}
                          alt="Original"
                          className="w-full h-full object-cover"
                          fill
                        />
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          Original
                        </div>
                      </div>
                      <div className="w-1/2 relative overflow-hidden">
                        {edit.editedImage ? (
                          <>
                            <Image
                              src={edit.editedImage}
                              alt="Edited"
                              className="w-full h-full object-cover"
                              fill
                            />
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                              AI Edit
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-[#0D1117] flex items-center justify-center">
                            <span className="text-[#8B949E] text-xs">
                              {edit.status === 'error' ? 'Failed' : 'Processing'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {edit.editedImage && (
                        <button
                          onClick={() => handleDownload(edit.editedImage!, edit.prompt)}
                          className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(edit.id)}
                        className="p-2 bg-black/60 hover:bg-red-500 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <p className="text-[#E6EDF3] text-sm mb-2 line-clamp-2">
                      {edit.prompt}
                    </p>
                    <div className="flex items-center gap-2 text-[#8B949E] text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(edit.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;