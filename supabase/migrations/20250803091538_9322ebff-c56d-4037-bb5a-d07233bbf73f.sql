-- Enable Row Level Security for downloads table
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert download records (public downloads tracking)
CREATE POLICY "Anyone can insert download records" 
ON public.downloads 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to read download stats (public stats page)
CREATE POLICY "Anyone can read download stats" 
ON public.downloads 
FOR SELECT 
USING (true);

-- Fix function search path for security
CREATE OR REPLACE FUNCTION get_download_stats(period_hours INTEGER DEFAULT 24)
RETURNS TABLE(
  software_name TEXT,
  download_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.software_name,
    COUNT(*) as download_count
  FROM public.downloads d
  WHERE d.downloaded_at >= NOW() - (period_hours || ' hours')::INTERVAL
  GROUP BY d.software_name
  ORDER BY download_count DESC;
END;
$$;