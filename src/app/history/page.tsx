"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/ui/TopBar";
import { Calendar, Search, Download, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";

type HistoryEntry = {
  id: string;
  originalImage: string;
  editedImage: string;
  prompt: string;
  created_at: string;
};

const History = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Fetch history for the current user
  const fetchUserHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_history")
        .select("history")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      const historyArray = Array.isArray(data?.history) ? data.history : [];
      return historyArray.sort((a: HistoryEntry, b: HistoryEntry) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (error) {
      console.error("Error fetching history:", error);
      return [];
    }
  };

  // Get user and load history
  useEffect(() => {
    const getUserAndLoadHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) return;
      
      const historyData = await fetchUserHistory(user.id);
      setHistory(historyData);
    };
    
    getUserAndLoadHistory();
  }, []);

  // Apply search filter
  useEffect(() => {
    const filtered = history.filter((edit) =>
      edit.prompt?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(filtered);
  }, [searchTerm, history]);

  // Format date properly
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Download edit
  const handleDownload = (imageUrl: string, prompt: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `edited-${prompt
      .slice(0, 20)
      .replace(/\s+/g, "-")
      .toLowerCase()}.jpg`;
    link.click();
  };

  // Delete edit from history
  const handleDelete = async (entryId: string) => {
    if (!user?.id) return;

    try {
      const updatedHistory = history.filter((entry) => entry.id !== entryId);

      const { error } = await supabase
        .from("user_history")
        .update({ history: updatedHistory })
        .eq("user_id", user.id);

      if (error) throw error;

      setHistory(updatedHistory);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <TopBar />

      <div className="pt-16 px-4 pb-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#E6EDF3] mb-2">
              Edit History
            </h1>
            <p className="text-[#8B949E]">
              Browse your previous AI transformations
            </p>
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
                {history.length === 0 ? "No edits yet" : "No matching results"}
              </h3>
              <p className="text-[#8B949E] mb-6">
                {history.length === 0
                  ? "Start creating amazing AI transformations!"
                  : "Try adjusting your search terms"}
              </p>
              {history.length === 0 && (
                <Link
                  href="/"
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Create First Edit
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden group"
                >
                  <div className="relative">
                    {/* Before/After Images */}
                    <div className="aspect-video bg-[#0D1117] flex">
                      <div className="w-1/2 relative overflow-hidden">
                        <Image
                          src={entry.originalImage}
                          alt="Original"
                          className="w-full h-full object-cover"
                          fill
                        />
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          Original
                        </div>
                      </div>

                      <div className="w-1/2 relative overflow-hidden">
                        <Image
                          src={entry.editedImage}
                          alt="Edited"
                          className="w-full h-full object-cover"
                          fill
                        />
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          AI Edit
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          handleDownload(entry.editedImage, entry.prompt)
                        }
                        className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 bg-black/60 hover:bg-red-500 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <p className="text-[#E6EDF3] text-sm mb-2 line-clamp-2">
                      {entry.prompt}
                    </p>
                    <div className="flex items-center gap-2 text-[#8B949E] text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(entry.created_at)}</span>
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