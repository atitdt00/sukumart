import fs from "fs/promises";
import path from "path";

export async function downloadImage(
  imageUrl,
  filename
) {
  if (!imageUrl) {
    return "";
  }

  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to download image: ${imageUrl}`
    );
  }

  const buffer = Buffer.from(
    await response.arrayBuffer()
  );

  const uploadDirectory = path.join(
    process.cwd(),
    "public",
    "image",
    "products"
  );

  await fs.mkdir(uploadDirectory, {
    recursive: true,
  });

  const filePath = path.join(
    uploadDirectory,
    filename
  );

  await fs.writeFile(filePath, buffer);

  return filename;
}