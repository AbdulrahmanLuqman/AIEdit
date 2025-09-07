import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });

export async function transformImage(
  imageBase64: string,
  prompt: string
): Promise<string> {
  try {
    // Remove the data URL prefix if present
    const base64Data = imageBase64.includes("base64,")
      ? imageBase64.split("base64,")[1]
      : imageBase64;

    const aiPrompt = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Data,
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: aiPrompt,
    });

    // Get the generated image from the response
    if (
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts
    ) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          return `data:image/png;base64,${imageData}`;
        }
      }
    }

    throw new Error("No image generated in the response");
  } catch (error) {
    console.error("Error transforming image:", error);
    throw error;
  }
}
