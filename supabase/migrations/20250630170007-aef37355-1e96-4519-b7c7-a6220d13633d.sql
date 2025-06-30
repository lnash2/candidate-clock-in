
-- Add unique constraint to note_types name column
ALTER TABLE public.note_types ADD CONSTRAINT note_types_name_unique UNIQUE (name);

-- Insert the initial note types from the image
INSERT INTO public.note_types (name, color) VALUES 
  ('1st Interview', '#3B82F6'),
  ('BD Call', '#10B981'),
  ('Candidate First Call - New Starter', '#8B5CF6'),
  ('Candidate First Contact', '#F59E0B'),
  ('Candidate Spec', '#EF4444'),
  ('Cold Call', '#6B7280'),
  ('Credit Check', '#06B6D4'),
  ('Credit Control', '#84CC16'),
  ('CV Sent', '#F97316'),
  ('Email', '#EC4899')
ON CONFLICT (name) DO NOTHING;
