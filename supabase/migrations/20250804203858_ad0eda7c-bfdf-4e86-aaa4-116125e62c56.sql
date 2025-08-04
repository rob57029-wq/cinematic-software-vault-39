-- Add country column to downloads table
ALTER TABLE public.downloads ADD COLUMN country TEXT;

-- Create index for better performance
CREATE INDEX idx_downloads_country ON public.downloads(country);
CREATE INDEX idx_downloads_user_ip_software_date ON public.downloads(user_ip, software_name, date_trunc('day', downloaded_at));

-- Function to get download stats over time (bar chart)
CREATE OR REPLACE FUNCTION get_download_stats_over_time(
  period_type TEXT DEFAULT 'day', -- 'hour', 'day', 'week'
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
DECLARE
  date_format TEXT;
  interval_step TEXT;
BEGIN
  -- Set format based on period type
  CASE period_type
    WHEN 'hour' THEN 
      date_format := 'YYYY-MM-DD HH24:00';
      interval_step := '1 hour';
    WHEN 'week' THEN 
      date_format := 'YYYY-"W"WW';
      interval_step := '1 week';
    ELSE -- 'day'
      date_format := 'YYYY-MM-DD';
      interval_step := '1 day';
  END CASE;

  RETURN QUERY
  WITH periods AS (
    SELECT generate_series(
      NOW() - (period_count || ' ' || CASE period_type WHEN 'hour' THEN 'hours' WHEN 'week' THEN 'weeks' ELSE 'days' END)::INTERVAL,
      NOW(),
      interval_step::INTERVAL
    ) as period_start
  ),
  unique_downloads AS (
    SELECT DISTINCT ON (user_ip, software_name, date_trunc('day', downloaded_at))
      software_name,
      downloaded_at,
      user_ip
    FROM public.downloads d
    WHERE (software_names IS NULL OR d.software_name = ANY(software_names))
      AND d.downloaded_at >= NOW() - (period_count || ' ' || CASE period_type WHEN 'hour' THEN 'hours' WHEN 'week' THEN 'weeks' ELSE 'days' END)::INTERVAL
    ORDER BY user_ip, software_name, date_trunc('day', downloaded_at), downloaded_at
  )
  SELECT 
    to_char(p.period_start, date_format) as period_label,
    COUNT(ud.downloaded_at) as download_count
  FROM periods p
  LEFT JOIN unique_downloads ud ON 
    CASE period_type
      WHEN 'hour' THEN date_trunc('hour', ud.downloaded_at) = date_trunc('hour', p.period_start)
      WHEN 'week' THEN date_trunc('week', ud.downloaded_at) = date_trunc('week', p.period_start)
      ELSE date_trunc('day', ud.downloaded_at) = date_trunc('day', p.period_start)
    END
  GROUP BY p.period_start, period_label
  ORDER BY p.period_start;
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
    SELECT DISTINCT ON (user_ip, software_name, date_trunc('day', downloaded_at))
      country,
      software_name
    FROM public.downloads d
    WHERE d.downloaded_at >= NOW() - (period_hours || ' hours')::INTERVAL
      AND (software_names IS NULL OR d.software_name = ANY(software_names))
      AND d.country IS NOT NULL
    ORDER BY user_ip, software_name, date_trunc('day', downloaded_at), downloaded_at
  )
  SELECT 
    COALESCE(ud.country, 'Unknown') as country,
    COUNT(*) as download_count
  FROM unique_downloads ud
  GROUP BY ud.country
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