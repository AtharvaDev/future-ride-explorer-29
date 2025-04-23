
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExpenseEntry, getAllExpenses, addExpense, updateExpense, deleteExpense } from '@/services/expenseService';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import DateRangeFilter from '@/components/filters/DateRangeFilter';
import VehicleSelector from '@/components/filters/VehicleSelector';
import { ArrowUpZA, ArrowDownAZ } from 'lucide-react';

const expenseTypes = [
  "Fuel",
  "Salary",
  "EMI",
  "Car Damage",
  "Insurance",
  "Other"
];

interface ExpensesTabProps {
  selectedVehicleId: string;
  onVehicleChange: (vehicleId: string) => void;
}

const ExpensesTab: React.FC<ExpensesTabProps> = ({
  selectedVehicleId,
  onVehicleChange
}) => {
  const [showForm, setShowForm] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [form, setForm] = useState<{
    date: string;
    type: string;
    amount: number;
    description: string;
    vehicleId: string;
  }>({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: expenseTypes[0],
    amount: 0,
    description: '',
    vehicleId: 'all'
  });

  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses', selectedVehicleId],
    queryFn: () => getAllExpenses(selectedVehicleId)
  });

  const addMutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add expense: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExpenseEntry> }) => 
      updateExpense(id, data),
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update expense: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete expense: ${error.message}`);
    }
  });

  const resetForm = () => {
    setForm({
      date: format(new Date(), 'yyyy-MM-dd'),
      type: expenseTypes[0],
      amount: 0,
      description: '',
      vehicleId: selectedVehicleId === 'all' ? 'all' : selectedVehicleId
    });
    setCurrentId(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    setCurrentId(null);
    setForm({
      date: format(new Date(), 'yyyy-MM-dd'),
      type: expenseTypes[0],
      amount: 0,
      description: '',
      vehicleId: selectedVehicleId === 'all' ? '' : selectedVehicleId
    });
    setShowForm(true);
  };

  const handleEdit = (expense: ExpenseEntry) => {
    if (!expense.id) return;
    
    setCurrentId(expense.id);
    setForm({
      date: expense.date instanceof Date 
        ? format(expense.date, 'yyyy-MM-dd')
        : format(new Date(expense.date), 'yyyy-MM-dd'),
      type: expense.type,
      amount: expense.amount,
      description: expense.description || '',
      vehicleId: expense.vehicleId || 'all'
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.type || form.amount <= 0 || !form.vehicleId || form.vehicleId === 'all') {
      toast.error('Please fill out all required fields and select a specific vehicle');
      return;
    }
    
    if (currentId) {
      updateMutation.mutate({ id: currentId, data: form });
    } else {
      addMutation.mutate(form);
    }
  };

  const filteredAndSortedExpenses = React.useMemo(() => {
    let result = [...expenses];

    if (startDate && endDate) {
      result = result.filter(expense => {
        const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
        return isWithinInterval(expenseDate, { 
          start: startOfDay(startDate), 
          end: endOfDay(endDate) 
        });
      });
    }

    result.sort((a, b) => {
      const aValue = sortField === 'date' ? a.date : a.amount;
      const bValue = sortField === 'date' ? b.date : b.amount;
      
      if (sortField === 'date') {
        const dateA = aValue instanceof Date ? aValue : new Date(aValue);
        const dateB = bValue instanceof Date ? bValue : new Date(bValue);
        return sortDirection === 'asc' 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      
      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return result;
  }, [expenses, startDate, endDate, sortField, sortDirection]);

  const filteredTotalExpenses = filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const filteredExpensesByType = filteredAndSortedExpenses.reduce((acc, expense) => {
    const type = expense.type;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Expenses (Filtered Total: ₹{filteredTotalExpenses.toLocaleString()})
        </h2>
        <Button onClick={handleAdd} className="bg-primary text-white">
          + Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Object.entries(filteredExpensesByType).map(([type, amount]) => (
          <Card key={type} className="p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{type}</h3>
            <p className="text-lg font-semibold">₹{amount.toLocaleString()}</p>
          </Card>
        ))}
      </div>

      {showForm && (
        <Card className="mb-6 p-6 shadow-md">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={form.type} 
                  onValueChange={(value) => setForm({ ...form, type: value })}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  placeholder="Enter amount"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleId">Vehicle</Label>
                <VehicleSelector 
                  value={form.vehicleId} 
                  onChange={(value) => setForm({ ...form, vehicleId: value })}
                  includeAll={false}
                />
              </div>
              <div className="space-y-2 md:col-span-2 lg:col-span-4">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-4">
              <Button type="submit" variant="default">
                {currentId ? 'Update' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <DateRangeFilter 
            startDate={startDate}
            endDate={endDate}
            onRangeChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
          
          <div className="ml-4">
            <Label htmlFor="vehicle-select" className="mr-2">Vehicle:</Label>
            <VehicleSelector 
              value={selectedVehicleId} 
              onChange={onVehicleChange}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select
            value={sortField}
            onValueChange={(value: 'date' | 'amount') => {
              setSortField(value);
              setSortDirection('desc');
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? (
              <ArrowUpZA className="h-4 w-4" />
            ) : (
              <ArrowDownAZ className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3">Loading expenses...</span>
        </div>
      ) : filteredAndSortedExpenses.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No expense data yet</p>
          <p className="text-sm text-gray-500">Add your first expense using the button above</p>
        </div>
      ) : (
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => toggleSort('date')}
              >
                Date {sortField === 'date' && (
                  sortDirection === 'asc' ? '↑' : '↓'
                )}
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => toggleSort('amount')}
              >
                Amount {sortField === 'amount' && (
                  sortDirection === 'asc' ? '↑' : '↓'
                )}
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {expense.date instanceof Date 
                    ? format(expense.date, 'dd MMM yyyy')
                    : format(new Date(expense.date), 'dd MMM yyyy')
                  }
                </TableCell>
                <TableCell>{expense.type}</TableCell>
                <TableCell>₹{expense.amount.toLocaleString()}</TableCell>
                <TableCell>{expense.description || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(expense)}
                      className="bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-700"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(expense.id!)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ExpensesTab;
