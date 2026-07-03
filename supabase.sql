-- Supabase schema for NYSC Survey Platform
-- This script creates the survey_responses table and indexes required by the React app.

CREATE TABLE IF NOT EXISTS survey_responses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  age TEXT,
  gender TEXT,
  current_status TEXT,
  ownership_statement TEXT,
  state TEXT,
  field_of_study TEXT,

  believe_home_before_35 TEXT,
  ideal_home_age TEXT,
  home_type TEXT,
  biggest_obstacle TEXT,
  preferred_city TEXT,
  preferred_city_other TEXT,

  saves_monthly TEXT,
  monthly_savings_amount TEXT,
  will_join_savings_plan TEXT,
  equity_contribution TEXT,

  preferred_product TEXT,
  would_join_small_amount TEXT,
  wants_investment_returns TEXT,
  desired_benefits TEXT[],

  wants_early_access TEXT,
  wants_free_assessment TEXT,

  full_name TEXT,
  phone_number TEXT,
  email_address TEXT,

  eligibility_status TEXT
);

-- Add missing columns when migrating an existing table.
ALTER TABLE IF EXISTS survey_responses
  ADD COLUMN IF NOT EXISTS ownership_statement TEXT,
  ADD COLUMN IF NOT EXISTS preferred_city_other TEXT,
  ADD COLUMN IF NOT EXISTS desired_benefits TEXT[];

-- Indexes for faster admin queries and exports.
CREATE INDEX IF NOT EXISTS idx_survey_created_at ON survey_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_eligibility ON survey_responses(eligibility_status);
CREATE INDEX IF NOT EXISTS idx_survey_current_status ON survey_responses(current_status);
CREATE INDEX IF NOT EXISTS idx_survey_phone_number ON survey_responses(phone_number);
