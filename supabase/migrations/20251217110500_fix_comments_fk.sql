-- Fix comments foreign key to reference profiles instead of auth.users
-- This allows PostgREST to properly join comments with profiles

DO $$
BEGIN
  -- Drop the existing constraint if it exists (name might vary but usually follows this pattern)
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'comments_user_id_fkey') THEN
    ALTER TABLE public.comments DROP CONSTRAINT comments_user_id_fkey;
  END IF;
END $$;

-- Add the correct constraint
ALTER TABLE public.comments
  ADD CONSTRAINT comments_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE CASCADE;
