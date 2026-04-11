import { supabase } from "./supabase";

export async function uploadReportImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
  const filePath = `reports/${fileName}`;

  const { error } = await supabase.storage
    .from('report-photos')
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('report-photos')
    .getPublicUrl(filePath);

  return publicUrl;
}