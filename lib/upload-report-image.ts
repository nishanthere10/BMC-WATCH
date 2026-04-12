import { supabase } from "./supabase";

export async function uploadReportImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `reports/${fileName}`;

  const { error } = await supabase.storage
    .from('report-photos')
    .upload(filePath, file);

  if (error) {
    if (error.message.includes('Bucket not found') || error.name === 'StorageApiError') {
      throw new Error("STORAGE_MISSING: The 'report-photos' bucket handles image uploads but is missing in your Supabase project. Please create a public storage bucket named 'report-photos'.");
    }
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('report-photos')
    .getPublicUrl(filePath);

  return publicUrl;
}