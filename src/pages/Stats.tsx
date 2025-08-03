import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useConfig } from "@/contexts/ConfigContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface DownloadStat {
  software_name: string;
  download_count: number;
}

const Stats = () => {
  const { config } = useConfig();
  const [hourlyStats, setHourlyStats] = useState<DownloadStat[]>([]);
  const [dailyStats, setDailyStats] = useState<DownloadStat[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<DownloadStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch hourly stats (last 1 hour)
      const { data: hourly } = await supabase.rpc('get_download_stats', { period_hours: 1 });
      
      // Fetch daily stats (last 24 hours)
      const { data: daily } = await supabase.rpc('get_download_stats', { period_hours: 24 });
      
      // Fetch weekly stats (last 7 days)
      const { data: weekly } = await supabase.rpc('get_download_stats', { period_hours: 168 });

      setHourlyStats(hourly || []);
      setDailyStats(daily || []);
      setWeeklyStats(weekly || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

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