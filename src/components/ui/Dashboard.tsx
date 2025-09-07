"use client"

import { useState } from 'react';
import { ImageEdit } from '@/types/definitions';
import TopBar from './TopBar';
import UploadArea from './UploadArea';

import PromptArea from "./PromptArea";
import ImageComparison from "./ImageComparison";
import LoadingOverlay from "./LoadingOverlay";
import Toast from "./Toast";

const Dashboard = () => {
  const [currentEdit, setCurrentEdit] = useState<ImageEdit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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

  // const handleGenerate = async (prompt: string) => {
  //   if (!currentEdit) return;

  //   setIsGenerating(true);
  //   const updatedEdit = { ...currentEdit, prompt, status: "pending" as const };
  //   setCurrentEdit(updatedEdit);

  //   try {
  //     // Transform image using AI service
  //     const editedImage = await transformImage(
  //       currentEdit.originalImage,
  //       prompt
  //     );

  //     const completedEdit: ImageEdit = {
  //       ...updatedEdit,
  //       editedImage,
  //       status: "completed",
  //     };

  //     setCurrentEdit(completedEdit);

  //     // Save to history
  //     // const history = JSON.parse(localStorage.getItem("imageHistory") || "[]");
  //     // history.unshift(completedEdit);
  //     // localStorage.setItem(
  //     //   "imageHistory",
  //     //   JSON.stringify(history.slice(0, 50))
  //     // );

  //     setToast({ message: "✨ AI transformation complete!", type: "success" });
  //   } catch (error) {
  //     const errorEdit = { ...updatedEdit, status: "error" as const };
  //     setCurrentEdit(errorEdit);
  //     setToast({
  //       message: "Failed to generate image. Please try again.",
  //       type: "error",
  //     });
  //     console.log("error:", error);
  //   }

  //   setIsGenerating(false);
  // };

  const handleGenerate = async (prompt: string) => {
  if (!currentEdit) return;

  setIsGenerating(true);

  const updatedEdit = { ...currentEdit, prompt, status: "pending" as const };
  setCurrentEdit(updatedEdit);

  try {
    // ✅ Call your secure API route (server-side Google call)
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64: currentEdit.originalImage,
        prompt,
      }),
    });

    if (!res.ok) throw new Error("Image generation failed");

    const { editedImage } = await res.json();

    // Build completed edit
    const completedEdit: ImageEdit = {
      ...updatedEdit,
      editedImage,
      status: "completed",
    };

    // Update UI instantly
    setCurrentEdit(completedEdit);

    // Save history in Supabase (instead of localStorage)
    // const { error: dbError } = await supabase.from("image_edits").insert([
    //   {
    //     user_id: currentUser.id,
    //     original_url: currentEdit.originalImage,
    //     edited_url: editedImage,
    //     prompt,
    //   },
    // ]);
    // if (dbError) console.error("DB save failed:", dbError);

    setToast({ message: "✨ AI transformation complete!", type: "success" });
  } catch (error) {
    const errorEdit = { ...updatedEdit, status: "error" as const };
    setCurrentEdit(errorEdit);
    setToast({
      message: "Failed to generate image. Please try again.",
      type: "error",
    });
    console.error("error:", error);
  }

  setIsGenerating(false);
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
            </div>

            {/* Right Section - Prompt & Results */}
            <div className="space-y-6">
              <PromptArea
                onGenerate={handleGenerate}
                isDisabled={!currentEdit?.originalImage || isGenerating}
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
