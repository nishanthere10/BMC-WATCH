"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { ratingSchema, RatingFormValues } from "@/lib/report-schema";
import { uploadReportImage } from "@/lib/upload-report-image";
import { supabase } from "@/lib/supabase";

import RatingSelector from "./rating-selector";
import PhotoUpload from "./photo-upload";
import AIAnalysisCard from "@/app/ai/ai-analysis-card";
import type { AIVerdict } from "@/app/ai/ai-analysis-card";
import AIAnalysisLoading from "@/app/ai/ai-analysis-loading";
import AIAnalysisAlert from "@/app/ai/ai-analysis-alert";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RatingFormProps {
  projectId: string;
  onSuccess: (data: { rating: number; points: number }) => void;
}

export default function ProjectRatingForm({ projectId, onSuccess }: RatingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIVerdict | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const { control, handleSubmit, register, setValue, formState: { errors } } = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    defaultValues: { projectId, rating: 0, comment: "" },
  });

  // Trigger AI analysis when photo is selected
  const handlePhotoChange = async (file: File | null) => {
    if (!file) {
      setAiAnalysis(null);
      setUploadedImageUrl(null);
      return;
    }

    setIsAnalyzing(true);
    setAiError(null);

    try {
      // 1. Upload to Supabase to get a public URL for the AI
      const url = await uploadReportImage(file);
      setUploadedImageUrl(url);

      // 2. Call the AI Auditor API
      const response = await fetch("/api/analyze-photo", {
        method: "POST",
        body: JSON.stringify({ imageUrl: url }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setAiAnalysis(data.analysis);
        // Auto-fill the AI's suggested rating
        if (data.analysis.suggested_rating && data.analysis.is_genuine) {
          setValue("rating", data.analysis.suggested_rating);
        }
      } else {
        throw new Error(data.error || "AI Analysis failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to analyze photo";
      if (message.includes("STORAGE_MISSING")) {
        setAiError(message);
      } else {
        setAiError(message);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = async (data: RatingFormValues) => {
    // Block submission if AI flagged it as spam
    if (aiAnalysis && !aiAnalysis.is_genuine) {
      alert("Your photo was not verified as a genuine site photo. Please retake the photo at the actual project site.");
      return;
    }

    setIsSubmitting(true);
    try {
      const finalImageUrl = uploadedImageUrl || await uploadReportImage(data.photo[0]);
      const pointsAwarded = aiAnalysis?.points_to_award || 0;

      const { data: _rating, error } = await supabase
        .from("project_ratings")
        .insert({
          project_id: projectId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          rating: data.rating,
          comment: data.comment,
          photo_url: finalImageUrl,
          ai_analysis: aiAnalysis,
          is_genuine: aiAnalysis?.is_genuine ?? false,
          ai_reasoning: aiAnalysis?.diagnosis_summary || "",
          points_awarded: pointsAwarded,
          status: "Verified",
        })
        .select()
        .single();

      if (error) throw error;

      // Award points via RPC
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (userId && pointsAwarded > 0) {
        await supabase.rpc("award_points", {
          p_user_id: userId,
          p_points: pointsAwarded,
        });
      }

      onSuccess({ rating: data.rating, points: pointsAwarded });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "";
      console.error("Submission failed:", error);
      if (message.includes("STORAGE_MISSING")) {
        alert(message);
      } else {
        alert("Failed to submit rating. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSpam = aiAnalysis && !aiAnalysis.is_genuine;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Photo Upload — triggers AI verification */}
      <Controller
        name="photo"
        control={control}
        render={({ field }) => (
          <PhotoUpload
            error={errors.photo?.message as string}
            onChange={(file) => {
              field.onChange(file ? [file] : []);
              handlePhotoChange(file);
            }}
          />
        )}
      />

      {/* AI Analysis Feedback Area */}
      <AnimatePresence mode="wait">
        {isAnalyzing && <AIAnalysisLoading key="ai-loading" />}
        {aiAnalysis && <AIAnalysisCard key="ai-result" analysis={aiAnalysis} />}
        {aiError && (
          <AIAnalysisAlert
            key="ai-error"
            error={aiError}
            onRetry={() => {}}
          />
        )}
      </AnimatePresence>

      {/* Star Rating */}
      <Controller
        name="rating"
        control={control}
        render={({ field }) => (
          <RatingSelector value={field.value} onChange={field.onChange} error={errors.rating?.message} />
        )}
      />

      {/* Comment */}
      <div className="space-y-2">
        <label className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Your Assessment
        </label>
        <Textarea
          {...register("comment")}
          placeholder={aiAnalysis?.opinion_starter || "Share your observations about this project..."}
          className="min-h-[80px]"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className={`w-full h-14 text-lg font-bold gap-2 transition-all ${
          isSpam
            ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
            : "bg-gradient-to-r from-[#2563EB] to-[#38BDF8] hover:from-[#1d4ed8] hover:to-[#0ea5e9] text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)]"
        }`}
        disabled={isSubmitting || isAnalyzing || !!isSpam}
      >
        {isSubmitting ? (
          <> <Loader2 className="animate-spin" /> Submitting Evaluation... </>
        ) : isSpam ? (
          <> Photo Not Verified </>
        ) : (
          <> <Star size={20} /> Submit Project Rating </>
        )}
      </Button>
    </form>
  );
}