import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useConfig } from "@/contexts/ConfigContext";
import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";
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
  
  // Country chart filters
  const [countryPeriod, setCountryPeriod] = useState<'hour' | 'day' | 'week' | 'custom'>('day');
  const [countryDateFrom, setCountryDateFrom] = useState<Date | undefined>();
  const [countryDateTo, setCountryDateTo] = useState<Date | undefined>();
  const [tempCountryDateFrom, setTempCountryDateFrom] = useState<Date | undefined>();
  const [tempCountryDateTo, setTempCountryDateTo] = useState<Date | undefined>();
  
  // Software stats for timeline chart
  const [softwareStats, setSoftwareStats] = useState<DownloadStat[]>([]);

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

      // Fetch timeline data
      const periodMap = { hour: 24, day: 7, week: 4 };
      const { data: timeline } = await supabase.rpc('get_download_stats_over_time', {
        period_type: selectedPeriod,
        period_count: periodMap[selectedPeriod],
        software_names: selectedSoftware.length > 0 ? selectedSoftware : null
      });

      // Convert timeline data to user's timezone
      const timelineWithTimezone = timeline?.map(item => ({
        ...item,
        period_label: selectedPeriod === 'hour' 
          ? formatInTimeZone(new Date(item.period_label.replace(':00', ':00:00')), userTimezone, 'yyyy-MM-dd HH:mm')
          : selectedPeriod === 'day'
          ? formatInTimeZone(new Date(item.period_label), userTimezone, 'yyyy-MM-dd')
          : item.period_label
      })) || [];

      setTimelineData(timelineWithTimezone);

      // Fetch software stats for timeline period
      const softwarePeriodMap = { hour: 1, day: 24, week: 168 };
      const { data: software } = await supabase.rpc('get_download_stats', {
        period_hours: softwarePeriodMap[selectedPeriod]
      });
      setSoftwareStats(software || []);

      // Fetch country data based on country period filter
      let countryPeriodHours = 24;
      if (countryPeriod === 'hour') {
        countryPeriodHours = 1;
      } else if (countryPeriod === 'week') {
        countryPeriodHours = 168;
      } else if (countryPeriod === 'custom' && countryDateFrom && countryDateTo) {
        countryPeriodHours = Math.ceil((countryDateTo.getTime() - countryDateFrom.getTime()) / (1000 * 60 * 60));
      }

      const { data: countries } = await supabase.rpc('get_download_stats_by_country', {
        period_hours: countryPeriodHours,
        software_names: selectedSoftware.length > 0 ? selectedSoftware : null
      });

      // Filter out Unknown countries
      const filteredCountries = (countries || []).filter(country => country.country !== 'Unknown');
      setCountryData(filteredCountries);
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

      // Filter out Unknown countries in live logs
      const filteredLogs = (data || []).map(log => ({
        ...log,
        country: log.country === 'Unknown' ? 'Hidden' : log.country
      }));
      setLiveLogs(filteredLogs);
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

    // Set up presence tracking for online users (track main page visitors)
    const presenceChannel = supabase.channel('main-page-users')
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
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(downloadChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [selectedSoftware, selectedPeriod]);

  useEffect(() => {
    fetchStats();
  }, [selectedSoftware, selectedPeriod, countryPeriod, countryDateFrom, countryDateTo]);

  const setCountryQuickPeriod = (period: 'hour' | 'day' | 'week') => {
    setCountryPeriod(period);
    setCountryDateFrom(undefined);
    setCountryDateTo(undefined);
    setTempCountryDateFrom(undefined);
    setTempCountryDateTo(undefined);
  };

  const applyCustomDates = () => {
    if (tempCountryDateFrom && tempCountryDateTo) {
      setCountryDateFrom(tempCountryDateFrom);
      setCountryDateTo(tempCountryDateTo);
      setCountryPeriod('custom');
    }
  };

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
            </CardContent>
          </Card>
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          {/* Software Stats for Timeline */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Статистика программ</CardTitle>
              <p className="text-sm text-muted-foreground">
                {selectedPeriod === 'hour' && 'За последний час'}
                {selectedPeriod === 'day' && 'За последние 24 часа'}
                {selectedPeriod === 'week' && 'За последнюю неделю'}
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Загрузка...</div>
              ) : softwareStats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Нет данных</div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {softwareStats.map((stat, index) => (
                    <div key={stat.software_name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium truncate">{stat.software_name}</span>
                      </div>
                      <Badge variant="secondary" className="shrink-0 ml-2">{stat.download_count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline Chart */}
          <Card className="xl:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Скачивания по времени</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                    <XAxis 
                      dataKey="period_label" 
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="download_count" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Country Statistics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          {/* Country Quick Stats */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Статистика по странам</CardTitle>
              <div className="flex flex-col gap-2 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={countryPeriod === 'hour' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCountryQuickPeriod('hour')}
                    className="text-xs"
                  >
                    Час
                  </Button>
                  <Button
                    variant={countryPeriod === 'day' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCountryQuickPeriod('day')}
                    className="text-xs"
                  >
                    24ч
                  </Button>
                </div>
                <Button
                  variant={countryPeriod === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCountryQuickPeriod('week')}
                  className="text-xs"
                >
                  Неделя
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={countryPeriod === 'custom' ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start text-left font-normal text-xs"
                    >
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {countryDateFrom && countryDateTo ? (
                        `${format(countryDateFrom, "dd.MM")} - ${format(countryDateTo, "dd.MM")}`
                      ) : (
                        "Даты"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">От:</label>
                        <Calendar
                          mode="single"
                          selected={tempCountryDateFrom}
                          onSelect={setTempCountryDateFrom}
                          disabled={(date) => date > new Date()}
                          className="pointer-events-auto"
                        />
                      </div>
                      {tempCountryDateFrom && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">До:</label>
                          <Calendar
                            mode="single"
                            selected={tempCountryDateTo}
                            onSelect={setTempCountryDateTo}
                            disabled={(date) => date > new Date() || date < tempCountryDateFrom}
                            className="pointer-events-auto"
                          />
                        </div>
                      )}
                      {tempCountryDateFrom && tempCountryDateTo && (
                        <Button 
                          onClick={applyCustomDates}
                          className="w-full"
                        >
                          Применить даты
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8">Загрузка...</div>
                ) : countryData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Нет данных</div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2 p-2 bg-muted/50 rounded-lg text-xs font-medium">
                      <span>Страна</span>
                      <span className="text-center">Кол-во</span>
                      <span className="text-right">%</span>
                    </div>
                    {countryData.map((stat, index) => {
                      const totalDownloads = countryData.reduce((sum, item) => sum + item.download_count, 0);
                      const percentage = totalDownloads > 0 ? ((stat.download_count / totalDownloads) * 100).toFixed(1) : '0';
                      return (
                        <div key={stat.country} className="grid grid-cols-3 gap-2 p-2 bg-background border rounded-lg text-sm hover:bg-muted/20 transition-colors">
                          <span className="font-medium truncate text-xs">{stat.country}</span>
                          <span className="text-center text-xs">{stat.download_count}</span>
                          <span className="text-right text-muted-foreground text-xs">{percentage}%</span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Country Chart */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Круговая диаграмма по странам</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ country, download_count }) => {
                        const totalDownloads = countryData.reduce((sum, item) => sum + item.download_count, 0);
                        const percentage = totalDownloads > 0 ? ((download_count / totalDownloads) * 100).toFixed(1) : '0';
                        return `${country} ${percentage}%`;
                      }}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="download_count"
                    >
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const totalDownloads = countryData.reduce((sum, item) => sum + item.download_count, 0);
                          const percentage = totalDownloads > 0 ? ((data.download_count / totalDownloads) * 100).toFixed(1) : '0';
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{data.country}</p>
                              <p className="text-sm text-muted-foreground">
                                Скачивания: {data.download_count} ({percentage}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Country Statistics Table */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Подробная статистика</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8">Загрузка...</div>
                ) : countryData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Нет данных</div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg text-sm font-medium">
                      <span>Страна</span>
                      <span className="text-center">Скачивания</span>
                      <span className="text-right">Процент</span>
                    </div>
                    {countryData.map((stat, index) => {
                      const totalDownloads = countryData.reduce((sum, item) => sum + item.download_count, 0);
                      const percentage = totalDownloads > 0 ? ((stat.download_count / totalDownloads) * 100).toFixed(1) : '0';
                      return (
                        <div key={stat.country} className="grid grid-cols-3 gap-4 p-3 bg-background border rounded-lg hover:bg-muted/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full shrink-0" 
                              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                            />
                            <span className="font-medium truncate text-sm">{stat.country}</span>
                          </div>
                          <span className="text-center font-medium text-sm">{stat.download_count}</span>
                          <span className="text-right text-muted-foreground text-sm">{percentage}%</span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
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
                    [{formatInTimeZone(new Date(log.downloaded_at), userTimezone, 'yyyy-MM-dd HH:mm:ss')}] {log.software_name}:{log.country || 'Hidden'}:{log.user_ip || 'Hidden'}
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