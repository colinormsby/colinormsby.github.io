import * as FileSystem from "expo-file-system";

/**
 * Remove the background from an image using the remove.bg API.
 *
 * Set EXPO_PUBLIC_REMOVEBG_API_KEY in your .env.local file.
 * Free tier: 50 API calls/month.
 * Sign up at https://www.remove.bg/
 *
 * Falls back to the original image if the key is not configured.
 */
export async function removeBackground(sourceUri: string): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_REMOVEBG_API_KEY;

  if (!apiKey) {
    console.warn(
      "[backgroundRemoval] No EXPO_PUBLIC_REMOVEBG_API_KEY set – returning original image."
    );
    return sourceUri;
  }

  // Read the source image as base64
  const base64 = await FileSystem.readAsStringAsync(sourceUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Call remove.bg
  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_file_b64: base64,
      size: "auto",
      format: "png",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[backgroundRemoval] API error:", response.status, text);
    return sourceUri; // graceful fallback
  }

  // Save the returned PNG to the app's document directory
  const resultBase64 = await response
    .blob()
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            resolve(dataUrl.split(",")[1]); // strip data:…;base64,
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

  const destUri =
    FileSystem.documentDirectory +
    `clothing_${Date.now()}_nobg.png`;

  await FileSystem.writeAsStringAsync(destUri, resultBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return destUri;
}

/**
 * Copy a photo into the app's permanent storage so it persists across sessions.
 */
export async function persistImage(sourceUri: string): Promise<string> {
  const fileName = `clothing_${Date.now()}_orig.jpg`;
  const destUri = FileSystem.documentDirectory + fileName;
  await FileSystem.copyAsync({ from: sourceUri, to: destUri });
  return destUri;
}
