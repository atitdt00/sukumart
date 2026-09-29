import cloudinary from "./cloudinary";

export async function uploadToCloudinary(
  file,
  folder = "sukumart",
) {
  if (!file || file.size === 0) {
    return null;
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("=================================");
          console.error("CLOUDINARY UPLOAD ERROR");
          console.error("=================================");
          console.error("Message:", error.message);
          console.error("Name:", error.name);
          console.error("HTTP Code:", error.http_code);
          console.error("Full error:", error);

          reject(error);
          return;
        }

        console.log("Cloudinary upload successful:", {
          public_id: result.public_id,
          secure_url: result.secure_url,
          resource_type: result.resource_type,
        });

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
}