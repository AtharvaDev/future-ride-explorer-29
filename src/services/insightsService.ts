
import { getEarningsByDateRange } from './earningsService';
import { getExpensesByDateRange } from './expenseService';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export interface InsightData {
  month: string;
  earnings: number;
  expenses: number;
  revenue: number;
}

/**
 * Get monthly financial insights
 * @param numMonths Number of past months to include
 * @param vehicleId Optional vehicle ID to filter by
 */
export const getMonthlyInsights = async (
  numMonths: number = 12,
  vehicleId?: string
): Promise<InsightData[]> => {
  try {
    const insights: InsightData[] = [];
    const today = new Date();
    
    for (let i = 0; i < numMonths; i++) {
      const monthDate = subMonths(today, i);
      const startDate = startOfMonth(monthDate);
      const endDate = endOfMonth(monthDate);
      const monthKey = format(monthDate, 'yyyy-MM');
      
      // Get earnings and expenses for the month
      const [earningData, expenseData] = await Promise.all([
        getEarningsByDateRange(startDate, endDate, vehicleId),
        getExpensesByDateRange(startDate, endDate, vehicleId)
      ]);
      
      // Calculate totals
      const totalEarnings = earningData.reduce((sum, entry) => sum + entry.cost, 0);
      const totalExpenses = expenseData.reduce((sum, entry) => sum + entry.amount, 0);
      const revenue = totalEarnings - totalExpenses;
      
      insights.push({
        month: monthKey,
        earnings: totalEarnings,
        expenses: totalExpenses,
        revenue: revenue
      });
    }
    
    // Sort by date (oldest to newest)
    return insights.sort((a, b) => a.month.localeCompare(b.month));
  } catch (error) {
    console.error("Error getting monthly insights:", error);
    throw error;
  }
};

/**
 * Get insights for a custom date range
 */
export const getCustomRangeInsights = async (
  startDate: Date, 
  endDate: Date,
  vehicleId?: string
): Promise<{
  earnings: number,
  expenses: number,
  revenue: number
}> => {
  try {
    // Get earnings and expenses for the custom range
    const [earningData, expenseData] = await Promise.all([
      getEarningsByDateRange(startDate, endDate, vehicleId),
      getExpensesByDateRange(startDate, endDate, vehicleId)
    ]);
    
    // Calculate totals
    const totalEarnings = earningData.reduce((sum, entry) => sum + entry.cost, 0);
    const totalExpenses = expenseData.reduce((sum, entry) => sum + entry.amount, 0);
    const revenue = totalEarnings - totalExpenses;
    
    return {
      earnings: totalEarnings,
      expenses: totalExpenses,
      revenue: revenue
    };
  } catch (error) {
    console.error("Error getting custom range insights:", error);
    throw error;
  }
};
