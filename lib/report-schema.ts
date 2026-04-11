import * as z from "zod";

export const reportSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  issueType: z.enum([
    "Delay", 
    "Poor Quality", 
    "Safety Hazard", 
    "Waterlogging Risk", 
    "Garbage / Debris"
  ]),
  rating: z.number()
    .min(1, "Please provide a rating between 1 and 5 stars")
    .max(5),
  comment: z.string()
    .max(500, "Please keep comments under 500 characters")
    .optional(),
  // For the form state, we handle the FileList or File object
  photo: z.any()
    .refine((files) => files?.length > 0, "A photo of the site is required as evidence.")
    .refine(
      (files) => !files?.[0] || files?.[0]?.size <= 5000000, 
      "The photo is too large. Please upload an image smaller than 5MB."
    )
    .refine(
      (files) => 
        !files?.[0] || ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
      "Only .jpg, .png, and .webp formats are accepted."
    ),
});

// This type helps TypeScript understand our form data shape
export type ReportFormValues = z.infer<typeof reportSchema>;