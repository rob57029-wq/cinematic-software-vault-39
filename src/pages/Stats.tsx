import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useConfig } from "@/contexts/ConfigContext";
import { formatInTimeZone } from "date-fns-tz";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, subDays, subWeeks, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface DownloadStat {
  software_name: string;
  download_count: number;
}

interface TimelineStat {
  period_label: string;
  download_count: number;
}

interface CountryStat {
  country: string;
  download_count: number;
}

interface LiveLogEntry {
  id: string;
  software_name: string;
  country: string;
  user_ip: string;
  downloaded_at: string;
}

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

const Stats = () => {
  const { config } = useConfig();
  const [hourlyStats, setHourlyStats] = useState<DownloadStat[]>([]);
  const [dailyStats, setDailyStats] = useState<DownloadStat[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<DownloadStat[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineStat[]>([]);
  const [countryData, setCountryData] = useState<CountryStat[]>([]);
  const [softwareNames, setSoftwareNames] = useState<string[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'hour' | 'day' | 'week'>('day');
  const [liveLogs, setLiveLogs] = useState<LiveLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [userTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);
  const [quickFilter, setQuickFilter] = useState<string>('day');

  const fetchSoftwareNames = async () => {
    try {
      const { data } = await supabase.rpc('get_software_names');
      setSoftwareNames(data?.map((item: any) => item.software_name) || []);
    } catch (error) {
      console.error('Error fetching software names:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch basic stats
      const { data: hourly } = await supabase.rpc('get_download_stats', { period_hours: 1 });
      const { data: daily } = await supabase.rpc('get_download_stats', { period_hours: 24 });
      const { data: weekly } = await supabase.rpc('get_download_stats', { period_hours: 168 });

      setHourlyStats(hourly || []);
      setDailyStats(daily || []);
      setWeeklyStats(weekly || []);

      // Calculate timeline parameters based on quick filter or custom dates
      let timelineParams = { period_type: selectedPeriod, period_count: 7, software_names: selectedSoftware.length > 0 ? selectedSoftware : null };
      
      if (customDateRange?.from && customDateRange?.to) {
        // Use custom date range
        const diffInDays = Math.ceil((customDateRange.to.getTime() - customDateRange.from.getTime()) / (1000 * 60 * 60 * 24));
        timelineParams.period_count = Math.max(1, diffInDays);
      } else {
        // Use quick filter
        const now = new Date();
        switch (quickFilter) {
          case 'hour':
            timelineParams = { period_type: 'hour', period_count: 1, software_names: selectedSoftware.length > 0 ? selectedSoftware : null };
            break;
          case 'today':
            timelineParams = { period_type: 'hour', period_count: 24, software_names: selectedSoftware.length > 0 ? selectedSoftware : null };
            break;
          case 'yesterday':
            timelineParams = { period_type: 'hour', period_count: 24, software_names: selectedSoftware.length > 0 ? selectedSoftware : null };
            break;
          case 'thisWeek':
            timelineParams = { period_type: 'day', period_count: 7, software_names: selectedSoftware.length > 0 ? selectedSoftware : null };
            break;
          case 'lastWeek':
            timelineParams = { period_type: 'day', period_count: 7, software_names: selectedSoftware.length > 0 ? selectedSoftware : null };
            break;
          default:
            timelineParams = { period_type: selectedPeriod, period_count: 7, software_names: selectedSoftware.length > 0 ? selectedSoftware : null };
        }
      }

      // Fetch timeline data
      const { data: timeline } = await supabase.rpc('get_download_stats_over_time', timelineParams);

      // Convert timeline data to user's timezone
      const timelineWithTimezone = timeline?.map(item => ({
        ...item,
        period_label: timelineParams.period_type === 'hour' 
          ? formatInTimeZone(new Date(item.period_label.replace(':00', ':00:00')), userTimezone, 'yyyy-MM-dd HH:mm')
          : timelineParams.period_type === 'day'
          ? formatInTimeZone(new Date(item.period_label), userTimezone, 'yyyy-MM-dd')
          : item.period_label
      })) || [];

      setTimelineData(timelineWithTimezone);

      // Fetch country data
      const { data: countries } = await supabase.rpc('get_download_stats_by_country', {
        period_hours: 24,
        software_names: selectedSoftware.length > 0 ? selectedSoftware : null
      });

      setCountryData(countries || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentLogs = async () => {
    try {
      const { data } = await supabase
        .from('downloads')
        .select('id, software_name, country, user_ip, downloaded_at')
        .order('downloaded_at', { ascending: false })
        .limit(100);

      setLiveLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    fetchSoftwareNames();
    fetchStats();
    fetchRecentLogs();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchRecentLogs();
    }, 30000);

    // Set up real-time subscription for downloads
    const downloadChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'downloads'
        },
        (payload) => {
          const newLog = payload.new as LiveLogEntry;
          setLiveLogs(prev => [newLog, ...prev.slice(0, 99)]);
          // Refresh stats when new download comes in
          fetchStats();
        }
      )
      .subscribe();

    // Set up presence tracking for online users
    const presenceChannel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        setOnlineUsers(Object.keys(state).length);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        setOnlineUsers(prev => prev + newPresences.length);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        setOnlineUsers(prev => Math.max(0, prev - leftPresences.length));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: Math.random().toString(36).substring(7),
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      clearInterval(interval);
      supabase.removeChannel(downloadChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [selectedSoftware, selectedPeriod, quickFilter, customDateRange]);

  useEffect(() => {
    fetchStats();
  }, [selectedSoftware, selectedPeriod, quickFilter, customDateRange]);

  const renderStatsTable = (stats: DownloadStat[], period: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Скачивания за {period}
          <Badge variant="secondary">{stats.reduce((sum, stat) => sum + stat.download_count, 0)} всего</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Загрузка статистики...</div>
        ) : stats.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Нет данных за этот период</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Программа</TableHead>
                <TableHead className="text-right">Скачивания</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat, index) => (
                <TableRow key={stat.software_name}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">#{index + 1}</span>
                      {stat.software_name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{stat.download_count}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  const chartConfig = {
    download_count: {
      label: "Скачивания",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Статистика скачиваний {config.site_name}
          </h1>
          <p className="text-muted-foreground text-lg">
            Данные обновляются в реальном времени каждые 30 секунд
          </p>
        </div>

        {/* Software Filter */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Фильтры</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Выберите программы</label>
                  <Select 
                    value={selectedSoftware.length > 0 ? selectedSoftware[0] : "all"} 
                    onValueChange={(value) => {
                      if (value === "all") {
                        setSelectedSoftware([]);
                      } else {
                        setSelectedSoftware([value]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Все программы" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все программы</SelectItem>
                      {softwareNames.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Период для графика</label>
                  <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hour">По часам</SelectItem>
                      <SelectItem value="day">По дням</SelectItem>
                      <SelectItem value="week">По неделям</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Quick filters */}
              <div className="mt-4">
                <label className="text-sm font-medium mb-2 block">Быстрые фильтры</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => {
                      setQuickFilter('hour');
                      setCustomDateRange(undefined);
                    }}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      quickFilter === 'hour' && !customDateRange?.from 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    Последний час
                  </button>
                  <button
                    onClick={() => {
                      setQuickFilter('today');
                      setCustomDateRange(undefined);
                    }}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      quickFilter === 'today' && !customDateRange?.from 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    Сегодня
                  </button>
                  <button
                    onClick={() => {
                      setQuickFilter('yesterday');
                      setCustomDateRange(undefined);
                    }}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      quickFilter === 'yesterday' && !customDateRange?.from 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    Вчера
                  </button>
                  <button
                    onClick={() => {
                      setQuickFilter('thisWeek');
                      setCustomDateRange(undefined);
                    }}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      quickFilter === 'thisWeek' && !customDateRange?.from 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    Эта неделя
                  </button>
                  <button
                    onClick={() => {
                      setQuickFilter('lastWeek');
                      setCustomDateRange(undefined);
                    }}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      quickFilter === 'lastWeek' && !customDateRange?.from 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    Прошлая неделя
                  </button>
                </div>
                
                {/* Custom date range */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">Или выберите даты:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className={`px-3 py-1 text-sm rounded-lg border transition-colors flex items-center gap-2 ${
                        customDateRange?.from 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-background hover:bg-muted border-border'
                      }`}>
                        <CalendarIcon className="h-4 w-4" />
                        {customDateRange?.from && customDateRange?.to 
                          ? `${format(customDateRange.from, 'dd.MM.yyyy')} - ${format(customDateRange.to, 'dd.MM.yyyy')}`
                          : customDateRange?.from 
                          ? format(customDateRange.from, 'dd.MM.yyyy')
                          : 'Выбрать период'
                        }
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={customDateRange}
                        onSelect={(range) => {
                          setCustomDateRange(range);
                          setQuickFilter('');
                        }}
                        numberOfMonths={2}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {customDateRange?.from && (
                    <button
                      onClick={() => {
                        setCustomDateRange(undefined);
                        setQuickFilter('day');
                      }}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Сбросить
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Скачивания по времени</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period_label" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="download_count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Country Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Скачивания по странам</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ country, percent }) => `${country} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="download_count"
                    >
                      {countryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Live Logs */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Лайв логи скачиваний</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
                {liveLogs.slice(0, 50).map((log) => (
                  <div key={log.id} className="text-green-400 mb-1">
                    [{formatInTimeZone(new Date(log.downloaded_at), userTimezone, 'yyyy-MM-dd HH:mm:ss')}] {log.software_name}:{log.country || 'Unknown'}:{log.user_ip || 'Hidden'}
                  </div>
                ))}
                {liveLogs.length === 0 && (
                  <div className="text-gray-500">Ожидание логов...</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hourly">Последний час</TabsTrigger>
            <TabsTrigger value="daily">Последние 24 часа</TabsTrigger>
            <TabsTrigger value="weekly">Последняя неделя</TabsTrigger>
          </TabsList>

          <TabsContent value="hourly">
            {renderStatsTable(hourlyStats, "последний час")}
          </TabsContent>

          <TabsContent value="daily">
            {renderStatsTable(dailyStats, "последние 24 часа")}
          </TabsContent>

          <TabsContent value="weekly">
            {renderStatsTable(weeklyStats, "последнюю неделю")}
          </TabsContent>
        </Tabs>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Пользователей онлайн</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {onlineUsers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Всего за час</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {hourlyStats.reduce((sum, stat) => sum + stat.download_count, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Всего за сутки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {dailyStats.reduce((sum, stat) => sum + stat.download_count, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Всего за неделю</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {weeklyStats.reduce((sum, stat) => sum + stat.download_count, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Stats;