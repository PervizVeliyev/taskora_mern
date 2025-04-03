import axios from "axios";

const generateImageURL = async (image) => {
  const file = new FormData();
  file.append("file", image);
  file.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

  try {
    const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
      method: "POST",
      body: file,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Cloudinary Error: ${errorData.error.message}`);
    }

    const data = await response.json();
    return data.secure_url; // 👈 MAKE SURE THIS LINE IS EXACTLY LIKE THIS
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export default generateImageURL;
