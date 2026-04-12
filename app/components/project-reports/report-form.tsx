"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, Sparkles } from "lucide-react";

import { reportSchema, ReportFormValues } from "@/lib/report-schema";
import { uploadReportImage } from "@/lib/upload-report-image";
import { supabase } from "@/lib/supabase";

import RatingSelector from "./rating-selector";
import IssueTypeSelect from "./issue-type-select";
import PhotoUpload from "./photo-upload";
import AIAnalysisCard from "../ai/ai-analysis-card";
import AIAnalysisLoading from "../ai/ai-analysis-loading";
import AIAnalysisAlert from "../ai/ai-analysis-alert";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReportFormProps {
  projectId: string;
  onSuccess: (reportData: any) => void;
}

export default function ReportForm({ projectId, onSuccess }: ReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string[] | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const { control, handleSubmit, register, formState: { errors } } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { projectId, rating: 0, comment: "" },
  });

  // This function triggers as soon as the user picks/takes a photo
  const handlePhotoChange = async (file: File | null) => {
    if (!file) {
      setAiAnalysis(null);
      setUploadedImageUrl(null);
      return;
    }

    setIsAnalyzing(true);
    setAiError(null);

    try {
      // 1. Upload to Supabase first to get a public URL for OpenAI
      const url = await uploadReportImage(file);
      setUploadedImageUrl(url);

      // 2. Call our Internal AI API
      const response = await fetch("/api/analyze-photo", {
        method: "POST",
        body: JSON.stringify({ imageUrl: url }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setAiAnalysis(data.analysis);
      } else {
        throw new Error(data.error || "AI Analysis failed");
      }
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    try {
      // We use the already uploadedImageUrl from the handlePhotoChange step
      const finalImageUrl = uploadedImageUrl || await uploadReportImage(data.photo[0]);

      const { data: report, error } = await supabase
        .from("reports")
        .insert({
          project_id: projectId,
          issue_type: data.issueType,
          rating: data.rating,
          comment: data.comment,
          photo_url: finalImageUrl,
          ai_analysis: aiAnalysis, // Save the AI insights to DB!
          status: "Submitted",
        })
        .select()
        .single();

      if (error) throw error;
      onSuccess(report);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="issueType"
        control={control}
        render={({ field }) => (
          <IssueTypeSelect value={field.value} onChange={field.onChange} error={errors.issueType?.message} />
        )}
      />

      {/* Photo Upload with AI Trigger */}
      <Controller
        name="photo"
        control={control}
        render={({ field }) => (
          <PhotoUpload 
            error={errors.photo?.message as string}
            onChange={(file) => {
              field.onChange(file ? [file] : []);
              handlePhotoChange(file); // Trigger AI analysis
            }} 
          />
        )}
      />

      {/* AI Analysis Feedback Area */}
      <AnimatePresence mode="wait">
        {isAnalyzing && <AIAnalysisLoading />}
        {aiAnalysis && <AIAnalysisCard analysis={aiAnalysis} />}
        {aiError && (
          <AIAnalysisAlert 
            error={aiError} 
            onRetry={() => {
              // Logic to retry could go here if needed
            }} 
          />
        )}
      </AnimatePresence>

      <Controller
        name="rating"
        control={control}
        render={({ field }) => (
          <RatingSelector value={field.value} onChange={field.onChange} error={errors.rating?.message} />
        )}
      />

      <div className="space-y-2">
        <label className="text-sm font-bold uppercase tracking-wider text-slate-700">Comments</label>
        <Textarea {...register("comment")} placeholder="Any extra details..." className="min-h-[80px]" />
      </div>

      <Button type="submit" className="w-full h-14 text-lg font-bold gap-2" disabled={isSubmitting || isAnalyzing}>
        {isSubmitting ? (
          <> <Loader2 className="animate-spin" /> Finalizing Report... </>
        ) : (
          <> <Send size={20} /> Submit Citizen Report </>
        )}
      </Button>
    </form>
  );
}