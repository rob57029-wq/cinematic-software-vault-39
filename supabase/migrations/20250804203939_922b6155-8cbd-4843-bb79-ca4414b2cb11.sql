-- Add country column to downloads table
ALTER TABLE public.downloads ADD COLUMN country TEXT;

-- Create simple indexes for better performance
CREATE INDEX idx_downloads_country ON public.downloads(country);
CREATE INDEX idx_downloads_user_ip ON public.downloads(user_ip);

-- Function to get download stats over time (bar chart)
CREATE OR REPLACE FUNCTION get_download_stats_over_time(
  period_type TEXT DEFAULT 'day',
  period_count INTEGER DEFAULT 7,
  software_names TEXT[] DEFAULT NULL
)
RETURNS TABLE(
  period_label TEXT,
  download_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH unique_downloads AS (
    SELECT DISTINCT 
      user_ip, 
      software_name, 
      downloaded_at::date as download_date,
      downloaded_at
    FROM public.downloads d
    WHERE (software_names IS NULL OR d.software_name = ANY(software_names))
      AND d.downloaded_at >= NOW() - (period_count || ' ' || 
        CASE period_type 
          WHEN 'hour' THEN 'hours' 
          WHEN 'week' THEN 'weeks' 
          ELSE 'days' 
        END)::INTERVAL
  ),
  grouped_downloads AS (
    SELECT 
      software_name,
      downloaded_at,
      ROW_NUMBER() OVER (PARTITION BY user_ip, software_name, download_date ORDER BY downloaded_at) as rn
    FROM unique_downloads
  )
  SELECT 
    CASE period_type
      WHEN 'hour' THEN to_char(date_trunc('hour', gd.downloaded_at), 'YYYY-MM-DD HH24:00')
      WHEN 'week' THEN to_char(date_trunc('week', gd.downloaded_at), 'YYYY-"W"WW')
      ELSE to_char(date_trunc('day', gd.downloaded_at), 'YYYY-MM-DD')
    END as period_label,
    COUNT(*) as download_count
  FROM grouped_downloads gd
  WHERE gd.rn = 1
  GROUP BY period_label, date_trunc(
    CASE period_type 
      WHEN 'hour' THEN 'hour' 
      WHEN 'week' THEN 'week' 
      ELSE 'day' 
    END, 
    gd.downloaded_at
  )
  ORDER BY date_trunc(
    CASE period_type 
      WHEN 'hour' THEN 'hour' 
      WHEN 'week' THEN 'week' 
      ELSE 'day' 
    END, 
    gd.downloaded_at
  );
END;
$$;

-- Function to get download stats by country (pie chart)
CREATE OR REPLACE FUNCTION get_download_stats_by_country(
  period_hours INTEGER DEFAULT 24,
  software_names TEXT[] DEFAULT NULL
)
RETURNS TABLE(
  country TEXT,
  download_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH unique_downloads AS (
    SELECT DISTINCT 
      user_ip, 
      software_name, 
      downloaded_at::date as download_date,
      country
    FROM public.downloads d
    WHERE d.downloaded_at >= NOW() - (period_hours || ' hours')::INTERVAL
      AND (software_names IS NULL OR d.software_name = ANY(software_names))
      AND d.country IS NOT NULL
  ),
  grouped_downloads AS (
    SELECT 
      country,
      ROW_NUMBER() OVER (PARTITION BY user_ip, software_name, download_date ORDER BY user_ip) as rn
    FROM unique_downloads
  )
  SELECT 
    COALESCE(gd.country, 'Unknown') as country,
    COUNT(*) as download_count
  FROM grouped_downloads gd
  WHERE gd.rn = 1
  GROUP BY gd.country
  ORDER BY download_count DESC;
END;
$$;

-- Function to get all unique software names
CREATE OR REPLACE FUNCTION get_software_names()
RETURNS TABLE(software_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT d.software_name
  FROM public.downloads d
  ORDER BY d.software_name;
END;
$$;

-- Enable realtime for downloads table
ALTER TABLE public.downloads REPLICA IDENTITY FULL;