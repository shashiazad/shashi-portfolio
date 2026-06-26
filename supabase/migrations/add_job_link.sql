-- Add job_link column to public.jobs table
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)

ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS job_link text;
