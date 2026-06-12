import { generateUUIDv7 } from "@/lib/uuid";
import { supabase } from "@/lib/supabase";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 Mo
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function uploadAgentPhoto(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("La photo ne doit pas dépasser 2 Mo.");
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Formats acceptés : .jpg, .jpeg, .png, .webp");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${generateUUIDv7()}.${fileExt}`;
  const filePath = `agents/photos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("excellentservice-erp")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("[SUPABASE_UPLOAD_ERROR]", uploadError);
    throw new Error("Échec de l'upload de la photo.");
  }

  const { data } = supabase.storage
    .from("excellentservice-erp")
    .getPublicUrl(filePath);
    
  return data.publicUrl;
}
