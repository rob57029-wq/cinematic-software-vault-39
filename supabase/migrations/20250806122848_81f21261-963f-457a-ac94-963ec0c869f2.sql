-- Fix the get_download_stats_by_country function to remove ambiguous column reference
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
    SELECT DISTINCT ON (d.user_ip, d.software_name, date_trunc('day', d.downloaded_at))
      d.country,
      d.software_name
    FROM public.downloads d
    WHERE d.downloaded_at >= NOW() - (period_hours || ' hours')::INTERVAL
      AND (software_names IS NULL OR d.software_name = ANY(software_names))
      AND d.country IS NOT NULL
    ORDER BY d.user_ip, d.software_name, date_trunc('day', d.downloaded_at), d.downloaded_at
  )
  SELECT 
    COALESCE(ud.country, 'Unknown') as country,
    COUNT(*) as download_count
  FROM unique_downloads ud
  GROUP BY ud.country
  ORDER BY download_count DESC;
END;
$$;