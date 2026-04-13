"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star, UserCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";

import { useAuth } from "@/app/hooks/use-auth";

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
  const { user, loading: authLoading } = useAuth();

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

      // Fire and forget blockchain logging
      fetch("/api/log-onchain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: _rating.id,
          payload: {
            reportId: _rating.id,
            projectId,
            rating: data.rating,
            comment: data.comment,
            aiReasoning: aiAnalysis?.diagnosis_summary || ""
          }
        })
      }).catch(err => console.error("Blockchain execution failed silently", err));

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

  if (authLoading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center border border-blue-100 dark:border-slate-700 shadow-sm">
          <UserCircle size={32} className="text-[#2563EB] dark:text-[#38BDF8]" />
        </div>
        <div>
          <h3 className="font-bold font-heading text-lg text-slate-900 dark:text-white">Login to Rate Projects</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">Help the community by evaluating site progress and earn civic points.</p>
        </div>
        <Link href="/login" className="cr-btn-primary mt-2 px-8 py-3.5">
          Login via Mobile
        </Link>
      </div>
    );
  }

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
        <label className="cr-label">
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
        className={`w-full h-14 text-lg font-bold gap-2 transition-all cr-btn ${
          isSpam
            ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500"
            : "cr-btn-primary"
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