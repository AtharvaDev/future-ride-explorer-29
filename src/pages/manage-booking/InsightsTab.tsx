
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMonthlyInsights, getCustomRangeInsights } from '@/services/insightsService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { format, addMonths, isBefore } from 'date-fns';
import VehicleSelector from '@/components/filters/VehicleSelector';

interface InsightsTabProps {
  selectedVehicleId: string;
  onVehicleChange: (vehicleId: string) => void;
}

const InsightsTab: React.FC<InsightsTabProps> = ({
  selectedVehicleId,
  onVehicleChange
}) => {
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: format(addMonths(new Date(), -2), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [customRange, setCustomRange] = useState<boolean>(false);
  
  // Get monthly insights data (default range)
  const { data: monthlyData = [], isLoading: isMonthlyLoading } = useQuery({
    queryKey: ['monthlyInsights', selectedVehicleId],
    queryFn: () => getMonthlyInsights(6, selectedVehicleId)
  });

  // Get custom range insights when requested
  const { data: customData, isLoading: isCustomLoading, refetch: refetchCustom } = useQuery({
    queryKey: ['customInsights', dateRange, selectedVehicleId],
    queryFn: () => getCustomRangeInsights(
      new Date(dateRange.start),
      new Date(dateRange.end),
      selectedVehicleId
    ),
    enabled: customRange
  });
  
  // Handle date range change
  const handleCustomRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomRange(true);
    refetchCustom();
  };
  
  // Validate date range
  const isDateRangeValid = () => {
    try {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return !isNaN(startDate.getTime()) && 
             !isNaN(endDate.getTime()) && 
             isBefore(startDate, endDate);
    } catch {
      return false;
    }
  };
  
  const isLoading = isMonthlyLoading || (customRange && isCustomLoading);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Financial Insights {selectedVehicleId !== 'all' && '(By Vehicle)'}
      </h2>
      
      {/* Custom date range selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filter by Date Range & Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <div className="w-full md:w-auto">
              <Label htmlFor="vehicle-select" className="block mb-2">Vehicle:</Label>
              <VehicleSelector 
                value={selectedVehicleId} 
                onChange={onVehicleChange}
              />
            </div>
          </div>

          <form onSubmit={handleCustomRangeSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="grid gap-1 flex-1">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="grid gap-1 flex-1">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <Button 
              type="submit" 
              className="self-end" 
              disabled={!isDateRangeValid()}
            >
              Apply Filter
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Custom range overview cards */}
      {customRange && customData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{customData.earnings.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{customData.expenses.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Net Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${customData.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{customData.revenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3">Loading financial data...</span>
        </div>
      ) : (
        <>
          {/* Monthly trend chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Financial Trends {selectedVehicleId !== 'all' && '(By Vehicle)'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`₹${(Number(value)).toLocaleString()}`, undefined]}
                    />
                    <Legend />
                    <Bar dataKey="earnings" fill="#10b981" name="Earnings" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    <Bar dataKey="revenue" fill="#9b87f5" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Revenue trend line chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`₹${(Number(value)).toLocaleString()}`, undefined]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#9b87f5" 
                      strokeWidth={3}
                      dot={{ stroke: '#9b87f5', strokeWidth: 2, r: 4 }}
                      activeDot={{ stroke: '#9b87f5', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default InsightsTab;
