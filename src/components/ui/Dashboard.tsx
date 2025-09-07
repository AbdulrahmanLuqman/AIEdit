"use client"

import { useState, useEffect } from 'react';
import { ImageEdit } from '@/types/definitions';
import TopBar from './TopBar';
import UploadArea from './UploadArea';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';

import PromptArea from "./PromptArea";
import ImageComparison from "./ImageComparison";
import LoadingOverlay from "./LoadingOverlay";
import Toast from "./Toast";

type HistoryEntry = {
  id: string;
  originalImage: string;
  editedImage: string;
  prompt: string;
  feature: string;
  created_at: string;
};

const Dashboard = () => {
  const [currentEdit, setCurrentEdit] = useState<ImageEdit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleImageUpload = (imageUrl: string) => {
    const newEdit: ImageEdit = {
      id: Math.random().toString(36).substr(2, 9),
      originalImage: imageUrl,
      prompt: "",
      timestamp: Date.now(),
      status: "pending",
    };
    setCurrentEdit(newEdit);
  };

  const addToHistory = async (historyEntry: HistoryEntry) => {
    if (!currentUser?.id) return;

    try {
      const { data: currentData, error: fetchError } = await supabase
        .from("user_history")
        .select("history")
        .eq("user_id", currentUser.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

      const currentHistory = currentData?.history || [];
      const updatedHistory = [...currentHistory, historyEntry];

      await supabase
        .from("user_history")
        .upsert({
          user_id: currentUser.id,
          history: updatedHistory
        }, { onConflict: "user_id" });

    } catch (error) {
        throw error;
    }
  };

  const handleGenerate = async (prompt: string, feature: string) => {
    if (feature === 'generate' && !currentEdit) {
      const newEdit: ImageEdit = {
        id: Math.random().toString(36).substr(2, 9),
        originalImage: '',
        prompt,
        timestamp: Date.now(),
        status: "pending",
      };
      setCurrentEdit(newEdit);
    }

    if (feature !== 'generate' && !currentEdit) return;

    setIsGenerating(true);

    const updatedEdit = currentEdit ? 
      { ...currentEdit, prompt, status: "pending" as const } : 
      {
        id: Math.random().toString(36).substr(2, 9),
        originalImage: '',
        prompt,
        timestamp: Date.now(),
        status: "pending" as const
      };
    
    setCurrentEdit(updatedEdit);

    try {
      const apiEndpoint = '/api/generate';
      const requestBody = getRequestBody(feature, updatedEdit.originalImage, prompt);

      // console.log(`Making request to ${apiEndpoint} with feature: ${feature}`);

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || `${feature} failed`);
      }

      const { editedImage } = await res.json();

      if (!editedImage) {
        throw new Error("No image received from the API");
      }
      const completedEdit: ImageEdit = {
        ...updatedEdit,
        editedImage,
        status: "completed",
      };

      setCurrentEdit(completedEdit);

      if (currentUser?.id) {
        const historyEntry: HistoryEntry = {
          id: Math.random().toString(36).substr(2, 9),
          originalImage: updatedEdit.originalImage,
          editedImage,
          prompt,
          feature,
          created_at: new Date().toISOString()
        };
        
        await addToHistory(historyEntry);
      }

      const featureLabels = {
        edit: 'Image editing',
        generate: 'Image generation',
        restore: 'Photo restoration'
      };

      setToast({ 
        message: `✨ ${featureLabels[feature as keyof typeof featureLabels] || 'AI transformation'} complete!`, 
        type: "success" 
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorEdit = { ...updatedEdit, status: "error" as const };
      setCurrentEdit(errorEdit);
      
      const featureLabels = {
        edit: 'edit image',
        generate: 'generate image',
        restore: 'restore photo'
      };
      
      setToast({
        message: `Failed to ${featureLabels[feature as keyof typeof featureLabels] || 'process'}: ${error.message || 'Unknown error'}`,
        type: "error",
      });
    }

    setIsGenerating(false);
  };

  const getRequestBody = (feature: string, originalImage: string, prompt: string) => {
    switch (feature) {
      case 'generate':
        return { prompt };
      case 'restore':
        return { 
          imageBase64: originalImage, 
          prompt: prompt || 'Restore and enhance this image' 
        };
      default:
        return { imageBase64: originalImage, prompt };
    }
  };

  const handleClearImage = () => {
    setCurrentEdit(null);
  };

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <TopBar />

      <div className="pt-16 px-4 pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 min-h-[calc(100vh-5rem)]">
            {/* Left Section - Upload */}
            <div className="space-y-6">
              <UploadArea
                onImageUpload={handleImageUpload}
                currentImage={currentEdit?.originalImage}
                onClear={handleClearImage}
              />
              <p className="text-sm text-red-500 font-semibold">
                Note: images generated before logging in won&apos;t be part of your history
              </p>
            </div>

            {/* Right Section - Prompt & Results */}
            <div className="space-y-6">
              <PromptArea
                onGenerate={handleGenerate}
                isDisabled={isGenerating}
                currentPrompt={currentEdit?.prompt || ""}
              />

              {currentEdit && (
                <ImageComparison
                  originalImage={currentEdit.originalImage}
                  editedImage={currentEdit.editedImage}
                  status={currentEdit.status}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {isGenerating && <LoadingOverlay />}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;