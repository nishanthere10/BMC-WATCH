"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";

import { reportSchema, ReportFormValues } from "@/lib/report-schema";
import { uploadReportImage } from "@/lib/upload-report-image";
import { supabase } from "@/lib/supabase";

import RatingSelector from "./rating-selector";
import IssueTypeSelect from "./issue-type-select";
import PhotoUpload from "./photo-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReportFormProps {
  projectId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (reportData: any) => void;
}

export default function ReportForm({ projectId, onSuccess }: ReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      projectId: projectId,
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Upload the photo first
      const photoUrl = await uploadReportImage(data.photo[0]);

      // 2. Submit report to Database
      const { data: report, error } = await supabase
        .from("reports")
        .insert({
          project_id: projectId,
          issue_type: data.issueType,
          rating: data.rating,
          comment: data.comment,
          photo_url: photoUrl,
          status: "Submitted",
        })
        .select()
        .single();

      if (error) throw error;
      
      onSuccess(report);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Issue Type */}
      <Controller
        name="issueType"
        control={control}
        render={({ field }) => (
          <IssueTypeSelect 
            value={field.value} 
            onChange={field.onChange} 
            error={errors.issueType?.message} 
          />
        )}
      />

      {/* Rating */}
      <Controller
        name="rating"
        control={control}
        render={({ field }) => (
          <RatingSelector 
            value={field.value} 
            onChange={field.onChange} 
            error={errors.rating?.message} 
          />
        )}
      />

      {/* Photo Upload */}
      <Controller
        name="photo"
        control={control}
        render={({ field }) => (
          <PhotoUpload 
            onChange={(file) => field.onChange(file ? [file] : [])} 
            error={errors.photo?.message as string} 
          />
        )}
      />

      {/* Comments */}
      <div className="space-y-2">
        <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Additional Comments
        </label>
        <Textarea
          {...register("comment")}
          placeholder="Give more details (e.g., 'Work has stopped for 3 days' or 'Debris blocking the main gate')..."
          className="min-h-[100px] resize-none"
        />
        {errors.comment && <p className="text-xs text-red-500">{errors.comment.message}</p>}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full h-14 text-lg font-bold gap-2" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" /> Submitting to BMC Watch...
          </>
        ) : (
          <>
            <Send size={20} /> Submit Citizen Report
          </>
        )}
      </Button>
    </form>
  );
}