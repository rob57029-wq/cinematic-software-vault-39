-- Create downloads table for tracking download statistics
CREATE TABLE public.downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  software_name TEXT NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_ip TEXT,
  user_agent TEXT
);

-- Create index for better performance on queries
CREATE INDEX idx_downloads_software_name ON public.downloads(software_name);
CREATE INDEX idx_downloads_downloaded_at ON public.downloads(downloaded_at);

-- Create function to get download stats
CREATE OR REPLACE FUNCTION get_download_stats(period_hours INTEGER DEFAULT 24)
RETURNS TABLE(
  software_name TEXT,
  download_count BIGINT
) AS $$
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
$$ LANGUAGE plpgsql;