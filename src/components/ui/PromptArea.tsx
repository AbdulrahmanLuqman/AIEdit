import React, { useState } from 'react';
import { Sparkles, Wand2, Palette, ShoppingBag, Megaphone, Camera } from 'lucide-react';

interface PromptAreaProps {
  onGenerate: (prompt: string) => void;
  isDisabled: boolean;
  currentPrompt: string;
}

const PromptArea: React.FC<PromptAreaProps> = ({ onGenerate, isDisabled, currentPrompt }) => {
  const [prompt, setPrompt] = useState(currentPrompt);

  const presets = [
    {
      id: 'comic',
      label: 'Comic Style',
      icon: Palette,
      prompt: 'Transform this into a vibrant comic book style with bold outlines, bright colors, and dramatic shading',
      category: 'Dynamic Storytelling'
    },
    {
      id: 'anime',
      label: 'Anime Style',
      icon: Sparkles,
      prompt: 'Convert this to anime/manga art style with large expressive eyes, soft shading, and vibrant colors',
      category: 'Dynamic Storytelling'
    },
    {
      id: 'product',
      label: 'Product Mockup',
      icon: ShoppingBag,
      prompt: 'Place this product in a modern, minimalist living room setting with professional lighting and clean background',
      category: 'E-Commerce'
    },
    {
      id: 'marketing',
      label: 'Marketing Ad',
      icon: Megaphone,
      prompt: 'Transform this into a professional marketing asset with Instagram-ready composition, vibrant colors, and commercial appeal',
      category: 'Creative Workflows'
    },
    {
      id: 'professional',
      label: 'Pro Photo Edit',
      icon: Camera,
      prompt: 'Enhance this photo with professional color grading, improved lighting, and cinematic quality',
      category: 'Photo Editing'
    }
  ];

  const suggestions = [
    "Make it look like a Pixar animation",
    "Turn it into a watercolor painting",
    "Add cyberpunk neon lighting",
    "Convert to black and white vintage photo",
    "Make it look like an oil painting",
    "Add dramatic sunset lighting"
  ];

  const handleGenerate = () => {
    if (prompt.trim() && !isDisabled) {
      onGenerate(prompt.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  };

  const handlePresetClick = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };
  return (
    <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-5 h-5 text-[#3B82F6]" />
        <h2 className="text-lg font-semibold text-[#E6EDF3]">Transform with AI</h2>
      </div>

      <div className="space-y-4">
        {/* Hackathon Theme Presets */}
        <div>
          <p className="text-sm font-medium text-[#E6EDF3] mb-3">Quick Presets:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {presets.map((preset) => {
              const IconComponent = preset.icon;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset.prompt)}
                  disabled={isDisabled}
                  className="group flex flex-col items-center gap-2 p-3 bg-[#0D1117] hover:bg-[#3B82F6] border border-[#30363D] hover:border-[#3B82F6] rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={preset.category}
                >
                  <IconComponent className="w-5 h-5 text-[#8B949E] group-hover:text-white transition-colors" />
                  <span className="text-xs text-[#8B949E] group-hover:text-white transition-colors text-center leading-tight">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#E6EDF3] mb-2">
            Describe your desired transformation
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Make this look like a Pixar animation with bright colors and cartoon style..."
            className="w-full h-24 px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-colors resize-none"
            disabled={isDisabled}
          />
          <p className="text-xs text-[#8B949E] mt-1">
            Tip: Press Ctrl+Enter to generate
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-[#E6EDF3] mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setPrompt(suggestion)}
                disabled={isDisabled}
                className="text-xs bg-[#0D1117] hover:bg-[#3B82F6] text-[#8B949E] hover:text-[#E6EDF3] px-3 py-1.5 rounded-full border border-[#30363D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isDisabled || !prompt.trim()}
          className="w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {isDisabled && prompt ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  );
};

export default PromptArea;