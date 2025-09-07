import React, { useState } from 'react';
import { Sparkles, Wand2, Palette, ShoppingBag, Megaphone, Camera, ChevronDown, ImageIcon, Paintbrush, RefreshCw } from 'lucide-react';

interface PromptAreaProps {
  onGenerate: (prompt: string, feature: string) => void;
  isDisabled: boolean;
  currentPrompt: string;
}

const PromptArea: React.FC<PromptAreaProps> = ({ onGenerate, isDisabled, currentPrompt }) => {
  const [prompt, setPrompt] = useState(currentPrompt);
  const [selectedFeature, setSelectedFeature] = useState('edit');
  const [showFeatureDropdown, setShowFeatureDropdown] = useState(false);

  const features = [
    {
      id: 'edit',
      label: 'Image Editing',
      icon: Paintbrush,
      description: 'Transform and edit existing images',
      placeholder: 'e.g., Make this look like a Pixar animation, change the background to a beach...'
    },
    {
      id: 'generate',
      label: 'Generate from Text',
      icon: ImageIcon,
      description: 'Create new images from text descriptions',
      placeholder: 'e.g., A photorealistic orange cat with green eyes sitting on a couch...'
    },
    {
      id: 'restore',
      label: 'Photo Restoration',
      icon: RefreshCw,
      description: 'Restore and enhance old or damaged photos',
      placeholder: 'e.g., Restore and colorize this old photo, enhance quality and remove scratches...'
    }
  ];

  const editPresets = [
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

  const generatePresets = [
    {
      id: 'portrait',
      label: 'Portrait',
      icon: Camera,
      prompt: 'A professional headshot portrait with studio lighting and neutral background',
      category: 'People'
    },
    {
      id: 'landscape',
      label: 'Landscape',
      icon: Palette,
      prompt: 'A breathtaking landscape with dramatic lighting and vivid colors',
      category: 'Nature'
    },
    {
      id: 'product-gen',
      label: 'Product Photo',
      icon: ShoppingBag,
      prompt: 'A clean product photography shot with professional lighting on white background',
      category: 'Commercial'
    },
    {
      id: 'abstract',
      label: 'Abstract Art',
      icon: Sparkles,
      prompt: 'An abstract digital art piece with flowing forms and vibrant colors',
      category: 'Art'
    },
    {
      id: 'architecture',
      label: 'Architecture',
      icon: Megaphone,
      prompt: 'Modern architectural photography with clean lines and dramatic perspective',
      category: 'Design'
    }
  ];

  const restorePresets = [
    {
      id: 'colorize',
      label: 'Colorize B&W',
      icon: Palette,
      prompt: 'Colorize this black and white photo with realistic, historically accurate colors',
      category: 'Enhancement'
    },
    {
      id: 'enhance',
      label: 'Enhance Quality',
      icon: Sparkles,
      prompt: 'Enhance image quality, reduce noise, sharpen details, and improve overall clarity',
      category: 'Quality'
    },
    {
      id: 'repair',
      label: 'Repair Damage',
      icon: RefreshCw,
      prompt: 'Repair scratches, tears, and damage while preserving the original character of the photo',
      category: 'Restoration'
    },
    {
      id: 'denoise',
      label: 'Remove Noise',
      icon: Camera,
      prompt: 'Remove grain and noise while maintaining sharp details and natural texture',
      category: 'Clean-up'
    },
    {
      id: 'upscale',
      label: 'Upscale',
      icon: Megaphone,
      prompt: 'Increase resolution and enhance details for a crisp, high-quality result',
      category: 'Enhancement'
    }
  ];

  const editSuggestions = [
    "Make it look like a Pixar animation",
    "Turn it into a watercolor painting",
    "Add cyberpunk neon lighting",
    "Convert to black and white vintage photo",
    "Make it look like an oil painting",
    "Add dramatic sunset lighting"
  ];

  const generateSuggestions = [
    "A majestic dragon flying over mountains",
    "Futuristic city with flying cars",
    "Cozy coffee shop in autumn",
    "Magical forest with glowing mushrooms",
    "Modern minimalist living room",
    "Sunset beach with palm trees"
  ];

  const restoreSuggestions = [
    "Restore and colorize this vintage photo",
    "Enhance the quality and remove grain",
    "Fix the scratches and tears",
    "Improve lighting and contrast",
    "Sharpen details and reduce blur",
    "Remove stains and discoloration"
  ];

  const getCurrentPresets = () => {
    switch (selectedFeature) {
      case 'generate': return generatePresets;
      case 'restore': return restorePresets;
      default: return editPresets;
    }
  };

  const getCurrentSuggestions = () => {
    switch (selectedFeature) {
      case 'generate': return generateSuggestions;
      case 'restore': return restoreSuggestions;
      default: return editSuggestions;
    }
  };

  const getCurrentPlaceholder = () => {
    const feature = features.find(f => f.id === selectedFeature);
    return feature?.placeholder || '';
  };

  const handleGenerate = () => {
    if (prompt.trim() && !isDisabled) {
      onGenerate(prompt.trim(), selectedFeature);
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

  const selectedFeatureData = features.find(f => f.id === selectedFeature);
  const SelectedIcon = selectedFeatureData?.icon || Wand2;

  return (
    <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-5 h-5 text-[#3B82F6]" />
        <h2 className="text-lg font-semibold text-[#E6EDF3]">Transform with AI</h2>
      </div>

      <div className="space-y-4">
        {/* Feature Selector */}
        <div>
          <label className="block text-sm font-medium text-[#E6EDF3] mb-2">
            Choose AI Feature:
          </label>
          <div className="relative">
            <button
              onClick={() => setShowFeatureDropdown(!showFeatureDropdown)}
              disabled={isDisabled}
              className="w-full flex items-center justify-between p-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] hover:border-[#3B82F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <SelectedIcon className="w-4 h-4 text-[#3B82F6]" />
                <span>{selectedFeatureData?.label}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#8B949E]" />
            </button>
            
            {showFeatureDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#0D1117] border border-[#30363D] rounded-lg shadow-lg z-10">
                {features.map((feature) => {
                  const IconComponent = feature.icon;
                  return (
                    <button
                      key={feature.id}
                      onClick={() => {
                        setSelectedFeature(feature.id);
                        setShowFeatureDropdown(false);
                        setPrompt(''); // Clear prompt when switching features
                      }}
                      className="w-full flex items-start gap-3 p-3 hover:bg-[#161B22] transition-colors text-left"
                    >
                      <IconComponent className="w-4 h-4 text-[#3B82F6] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-[#E6EDF3] font-medium">{feature.label}</div>
                        <div className="text-[#8B949E] text-xs">{feature.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Presets based on selected feature */}
        <div>
          <p className="text-sm font-medium text-[#E6EDF3] mb-3">Quick Presets:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {getCurrentPresets().map((preset) => {
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

        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-[#E6EDF3] mb-2">
            Describe your desired transformation
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getCurrentPlaceholder()}
            className="w-full h-24 px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-colors resize-none"
            disabled={isDisabled}
          />
          <p className="text-xs text-[#8B949E] mt-1">
            Tip: Press Ctrl+Enter to generate
          </p>
        </div>

        {/* Dynamic Suggestions */}
        <div>
          <p className="text-sm font-medium text-[#E6EDF3] mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {getCurrentSuggestions().map((suggestion, index) => (
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

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isDisabled || !prompt.trim()}
          className="w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <SelectedIcon className="w-4 h-4" />
          {isDisabled && prompt ? 'Generating...' : `Generate with ${selectedFeatureData?.label}`}
        </button>
      </div>
    </div>
  );
};

export default PromptArea;