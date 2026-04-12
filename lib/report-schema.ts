import * as z from "zod";

export const ratingSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  rating: z.number()
    .min(1, "Please provide a rating between 1 and 5 stars")
    .max(5),
  comment: z.string()
    .max(500, "Please keep comments under 500 characters")
    .optional(),
  photo: z.any()
    .refine((files) => files?.length > 0, "A photo of the site is required for verification.")
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

export type RatingFormValues = z.infer<typeof ratingSchema>;