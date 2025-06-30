
-- Add fields to bookings table to support open bookings and candidate assignments
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS candidate_id UUID REFERENCES public.candidates(id),
ADD COLUMN IF NOT EXISTS driver_class TEXT,
ADD COLUMN IF NOT EXISTS booking_type TEXT DEFAULT 'open' CHECK (booking_type IN ('open', 'assigned'));

-- Update status column to include 'open' status
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('open', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'));

-- Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_bookings_candidate_id ON public.bookings(candidate_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_type ON public.bookings(booking_type);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
