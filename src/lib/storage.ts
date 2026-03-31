import { createClient } from "./supabase";

const BUCKET = "course-materials";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadMaterial(
  file: File,
  groupId: string,
  sessionId: string
): Promise<{ path: string } | { error: string }> {
  if (file.type !== "application/pdf") {
    return { error: "Nur PDF-Dateien erlaubt." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "Datei ist zu groß (max. 10 MB)." };
  }

  const path = `${groupId}/${sessionId}.pdf`;
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true });

  if (error) {
    return { error: "Fehler beim Hochladen: " + error.message };
  }

  return { path };
}

export async function deleteMaterial(path: string): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([path]);
}

export async function getMaterialUrl(
  path: string
): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60); // 60 minutes

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
