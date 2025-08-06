-- Fix the get_download_stats_over_time function to match other stats functions
CREATE OR REPLACE FUNCTION public.get_download_stats_over_time(
  period_type text DEFAULT 'day'::text, 
  period_count integer DEFAULT 7, 
  software_names text[] DEFAULT NULL::text[]
)
RETURNS TABLE(period_label text, download_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH filtered_downloads AS (
    SELECT 
      d.software_name,
      d.downloaded_at
    FROM public.downloads d
    WHERE (software_names IS NULL OR d.software_name = ANY(software_names))
      AND d.downloaded_at >= NOW() - (period_count || ' ' || 
        CASE period_type 
          WHEN 'hour' THEN 'hours' 
          WHEN 'week' THEN 'weeks' 
          ELSE 'days' 
        END)::INTERVAL
  )
  SELECT 
    CASE period_type
      WHEN 'hour' THEN to_char(date_trunc('hour', fd.downloaded_at), 'YYYY-MM-DD HH24:00')
      WHEN 'week' THEN to_char(date_trunc('week', fd.downloaded_at), 'YYYY-"W"WW')
      ELSE to_char(date_trunc('day', fd.downloaded_at), 'YYYY-MM-DD')
    END as period_label,
    COUNT(*) as download_count
  FROM filtered_downloads fd
  GROUP BY period_label, date_trunc(
    CASE period_type 
      WHEN 'hour' THEN 'hour' 
      WHEN 'week' THEN 'week' 
      ELSE 'day' 
    END, 
    fd.downloaded_at
  )
  ORDER BY date_trunc(
    CASE period_type 
      WHEN 'hour' THEN 'hour' 
      WHEN 'week' THEN 'week' 
      ELSE 'day' 
    END, 
    fd.downloaded_at
  );
END;
$function$