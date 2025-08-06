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

      setTimelineData(timeline || []);

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

    // Set up real-time subscription
    const channel = supabase
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

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [selectedSoftware, selectedPeriod]);

  useEffect(() => {
    fetchStats();
  }, [selectedSoftware, selectedPeriod]);

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
                    [{new Date(log.downloaded_at).toLocaleString()}] {log.software_name}:{log.country || 'Unknown'}:{log.user_ip || 'Hidden'}
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

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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