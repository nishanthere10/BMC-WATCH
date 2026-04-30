-- ==============================================================================
-- BMC WATCH - SYSTEM TRUTH LAYER (PHASE 1, 2, & 3)
-- Run this script ONCE in your Supabase SQL Editor.
-- ==============================================================================

-- 1️⃣ PHASE 1: CREATE THE PROJECT STATE TABLE
CREATE TABLE IF NOT EXISTS public.project_state (
    project_id UUID PRIMARY KEY,
    current_status TEXT NOT NULL DEFAULT 'Unknown',
    confidence_score FLOAT NOT NULL DEFAULT 0.0,
    report_count INT NOT NULL DEFAULT 0,
    is_conflicting BOOLEAN NOT NULL DEFAULT FALSE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast map/dashboard lookups
CREATE INDEX IF NOT EXISTS idx_project_state_status ON public.project_state(current_status);

-- 1.5️⃣ PHASE 1b: CREATE INDEX FOR AGGREGATION PERFORMANCE
-- Ensures that the trigger aggregates instantly even with millions of rows
CREATE INDEX IF NOT EXISTS idx_project_ratings_project_status ON public.project_ratings(project_id, status);

-- 2️⃣ PHASE 2: THE AUTOMATIC STATE ENGINE (TRIGGER FUNCTION)
CREATE OR REPLACE FUNCTION public.update_project_state()
RETURNS TRIGGER AS $$
DECLARE
    v_project_id UUID;
    v_count INT;
    v_avg FLOAT;
    v_variance FLOAT;
    v_status TEXT;
    v_confidence FLOAT;
    v_conflicting BOOLEAN;
BEGIN
    -- Handle DELETE operations where NEW is null
    IF TG_OP = 'DELETE' THEN
        v_project_id := OLD.project_id;
    ELSE
        v_project_id := NEW.project_id;
    END IF;

    -- 1. Calculate Aggregates natively in Postgres (Lightning Fast)
    -- We use COALESCE to handle nulls if a project has no ratings left
    SELECT 
        COUNT(*),
        COALESCE(AVG(rating), 0),
        COALESCE(VAR_POP(rating), 0)
    INTO 
        v_count, 
        v_avg, 
        v_variance
    FROM public.project_ratings 
    WHERE project_id = v_project_id AND status = 'Verified';

    -- 2. Derive Status based on average
    IF v_avg >= 4.0 THEN
        v_status := 'Good';
    ELSIF v_avg >= 2.5 THEN
        v_status := 'Needs Attention';
    ELSE
        v_status := 'High Risk';
    END IF;

    -- 3. Calculate Confidence (Logarithmic scale based on count)
    -- Maxes out at 1.0 (100%)
    IF v_count = 0 THEN
        v_confidence := 0;
    ELSE
        v_confidence := LEAST(1.0, LN(v_count + 1) / 3.0);
    END IF;

    -- 4. Check for Conflict (Variance > 1.5 means high disagreement)
    v_conflicting := v_variance > 1.5;

    -- 5. Upsert into project_state
    INSERT INTO public.project_state (project_id, current_status, confidence_score, report_count, is_conflicting, last_updated)
    VALUES (v_project_id, v_status, v_confidence, v_count, v_conflicting, NOW())
    ON CONFLICT (project_id) DO UPDATE 
    SET 
        current_status = EXCLUDED.current_status,
        confidence_score = EXCLUDED.confidence_score,
        report_count = EXCLUDED.report_count,
        is_conflicting = EXCLUDED.is_conflicting,
        last_updated = EXCLUDED.last_updated;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3️⃣ PHASE 2b: BIND THE TRIGGER TO PROJECT RATINGS
DROP TRIGGER IF EXISTS trigger_update_project_state ON public.project_ratings;
CREATE TRIGGER trigger_update_project_state
AFTER INSERT OR UPDATE OR DELETE ON public.project_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_project_state();

-- 4️⃣ PHASE 3: ONE-TIME HISTORICAL BACKFILL
-- This runs the exact same logic for all existing data instantly
INSERT INTO public.project_state (project_id, current_status, confidence_score, report_count, is_conflicting, last_updated)
SELECT 
    project_id,
    CASE 
        WHEN AVG(rating) >= 4.0 THEN 'Good'
        WHEN AVG(rating) >= 2.5 THEN 'Needs Attention'
        ELSE 'High Risk'
    END as current_status,
    LEAST(1.0, LN(COUNT(*) + 1) / 3.0) as confidence_score,
    COUNT(*) as report_count,
    COALESCE(VAR_POP(rating), 0) > 1.5 as is_conflicting,
    NOW()
FROM public.project_ratings
WHERE status = 'Verified'
GROUP BY project_id
ON CONFLICT (project_id) DO UPDATE 
SET 
    current_status = EXCLUDED.current_status,
    confidence_score = EXCLUDED.confidence_score,
    report_count = EXCLUDED.report_count,
    is_conflicting = EXCLUDED.is_conflicting,
    last_updated = EXCLUDED.last_updated;
