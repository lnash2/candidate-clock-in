
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Building2, Users, Calendar, DollarSign, MessageSquare, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { useCustomers } from '@/hooks/useCustomers';
import { useCandidates } from '@/hooks/useCandidates';
import { useBookings } from '@/hooks/useBookings';
import { useCompanyRates } from '@/hooks/useCompanyRates';

const CRMOverview = () => {
  const { customers, loading: customersLoading } = useCustomers();
  const { candidates, loading: candidatesLoading } = useCandidates();
  const { bookings, loading: bookingsLoading } = useBookings();
  const { rates, loading: ratesLoading } = useCompanyRates();
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalCandidates: 0,
    activeBookings: 0,
    totalRates: 0,
    recentBookings: 0,
    avgHourlyRate: 0
  });
  const [monthlyBookingsData, setMonthlyBookingsData] = useState<any[]>([]);
  const [bookingsByStatus, setBookingsByStatus] = useState<any[]>([]);

  useEffect(() => {
    if (!customersLoading && !candidatesLoading && !bookingsLoading && !ratesLoading) {
      const activeBookings = bookings.filter(b => b.status === 'open' || b.status === 'confirmed').length;
      const recentBookings = bookings.filter(b => {
        const bookingDate = new Date(b.created_at * 1000);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return bookingDate >= weekAgo;
      }).length;
      
      const candidateRates = candidates
        .map(c => c.hourly_rate)
        .filter(rate => rate !== null && rate > 0) as number[];
      const avgHourlyRate = candidateRates.length > 0 
        ? candidateRates.reduce((sum, rate) => sum + rate, 0) / candidateRates.length 
        : 0;

      setStats({
        totalCompanies: customers.length,
        totalCandidates: candidates.length,
        activeBookings,
        totalRates: rates.length,
        recentBookings,
        avgHourlyRate: Math.round(avgHourlyRate * 100) / 100
      });

      // Process bookings data for charts
      const now = new Date();
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);

      // Filter bookings from the past month
      const monthlyBookings = bookings.filter(b => {
        const bookingDate = new Date(b.created_at * 1000);
        return bookingDate >= monthAgo && bookingDate <= now;
      });

      // Group bookings by day for line chart
      const bookingsByDay = monthlyBookings.reduce((acc: { [key: string]: number }, booking) => {
        const date = new Date(booking.created_at * 1000).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Create array for chart with all days in the past month
      const chartData = [];
      for (let d = new Date(monthAgo); d <= now; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        chartData.push({
          date: dateStr,
          bookings: bookingsByDay[dateStr] || 0,
          day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }

      setMonthlyBookingsData(chartData);

      // Group bookings by status for bar chart
      const statusCounts = monthlyBookings.reduce((acc: { [key: string]: number }, booking) => {
        const status = booking.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count
      }));

      setBookingsByStatus(statusData);
    }
  }, [customers, candidates, bookings, rates, customersLoading, candidatesLoading, bookingsLoading, ratesLoading]);

  return (
    <div className="h-full bg-white pl-5 pr-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Active clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">Available drivers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
            <p className="text-xs text-muted-foreground">Current assignments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Hourly Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">£{stats.avgHourlyRate}</div>
            <p className="text-xs text-muted-foreground">Per hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Bookings</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.recentBookings}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company Rates</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalRates}</div>
            <p className="text-xs text-muted-foreground">Rate configurations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bookings Over Past Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                bookings: {
                  label: "Bookings",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[300px]"
            >
              <LineChart data={monthlyBookingsData}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => `Date: ${value}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bookings by Status (Past Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={bookingsByStatus}>
                <XAxis 
                  dataKey="status" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">New booking</span> from Cheltenham Racecourse
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Email sent</span> to Newmarket Stables
                  <div className="text-xs text-muted-foreground">4 hours ago</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Follow-up required</span> for Ascot Holdings
                  <div className="text-xs text-muted-foreground">1 day ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cheltenham Racecourse</span>
                <span className="text-sm text-green-600 font-bold">£12,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Newmarket Training</span>
                <span className="text-sm text-green-600 font-bold">£9,800</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Royal Windsor Stables</span>
                <span className="text-sm text-green-600 font-bold">£7,300</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CRMOverview;
