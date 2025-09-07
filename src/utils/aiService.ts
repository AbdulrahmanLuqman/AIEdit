export async function transformImage(
  imageBase64: string,
  prompt: string
): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, prompt }),
  });

  if (!res.ok) {
    throw new Error("Failed to transform image");
  }

  const data = await res.json();
  return data.editedImage;
}

