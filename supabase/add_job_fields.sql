-- Add job_location and job_id columns to jobs table
-- Run this in Supabase SQL Editor

ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS job_location text,
ADD COLUMN IF NOT EXISTS job_id text;
