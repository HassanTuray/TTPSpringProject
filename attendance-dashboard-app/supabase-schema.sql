-- Supabase Database Schema for Attendance Dashboard
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ============================================
-- 1. USER PROFILES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  year TEXT NOT NULL,
  major TEXT NOT NULL,
  main_club TEXT NOT NULL,
  num_events_attended INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT num_events_attended_non_negative CHECK (num_events_attended >= 0)
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Anyone can read all profiles"
  ON public.user_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. EVENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  host_clubs TEXT[] DEFAULT '{}' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Anyone can read events"
  ON public.events
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert events"
  ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- TODO: Add admin role check when roles are implemented

-- ============================================
-- 3. ATTENDANCE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.attendance (
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attendance
CREATE POLICY "Anyone can read all attendance"
  ON public.attendance
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own attendance"
  ON public.attendance
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own attendance"
  ON public.attendance
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for events
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. AUTO-UPDATE events_attended COUNT
-- ============================================

-- Function to update events_attended count when attendance changes
CREATE OR REPLACE FUNCTION update_events_attended_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment count when attendance is added
    UPDATE public.user_profiles
    SET events_attended = events_attended + 1
    WHERE user_id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement count when attendance is removed
    UPDATE public.user_profiles
    SET events_attended = GREATEST(events_attended - 1, 0)
    WHERE user_id = OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update events_attended
CREATE TRIGGER trigger_update_events_attended
  AFTER INSERT OR DELETE ON public.attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_events_attended_count();
  
-- ============================================
-- SCHEMA SETUP COMPLETE
-- ============================================

-- Verify tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'events', 'attendance')
ORDER BY table_name;
