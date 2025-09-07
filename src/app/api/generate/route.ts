import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

export async function POST(req: Request) {
  try {
    const { imageBase64, prompt } = await req.json();

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

    if (
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content?.parts
    ) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          return Response.json({
            editedImage: `data:image/png;base64,${imageData}`,
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ error: "No image generated in the response" }),
      { status: 500 }
    );
  } catch (error) {
    console.error("Error transforming image:", error);
    throw error;
  }
}
