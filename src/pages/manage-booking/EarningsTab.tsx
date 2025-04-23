import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EarningEntry, getAllEarnings, addEarning, updateEarning, deleteEarning } from '@/services/earningsService';
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
import { ArrowUpZA, ArrowDownAZ } from 'lucide-react';

const EarningsTab: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [sortField, setSortField] = useState<'date' | 'cost'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [form, setForm] = useState<{
    date: string;
    user: string;
    source: string;
    destination: string;
    cost: number;
    offline: boolean;
  }>({
    date: format(new Date(), 'yyyy-MM-dd'),
    user: '',
    source: '',
    destination: '',
    cost: 0,
    offline: true
  });

  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['earnings'],
    queryFn: getAllEarnings
  });

  const addMutation = useMutation({
    mutationFn: addEarning,
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['earnings'] });
      toast.success('Earning entry added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add earning: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EarningEntry> }) => 
      updateEarning(id, data),
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['earnings'] });
      toast.success('Earning entry updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update earning: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEarning,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['earnings'] });
      toast.success('Earning entry deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete earning: ${error.message}`);
    }
  });

  const resetForm = () => {
    setForm({
      date: format(new Date(), 'yyyy-MM-dd'),
      user: '',
      source: '',
      destination: '',
      cost: 0,
      offline: true
    });
    setCurrentId(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    setCurrentId(null);
    setForm({
      date: format(new Date(), 'yyyy-MM-dd'),
      user: '',
      source: '',
      destination: '',
      cost: 0,
      offline: true
    });
    setShowForm(true);
  };

  const handleEdit = (entry: EarningEntry) => {
    if (!entry.id) return;
    
    setCurrentId(entry.id);
    setForm({
      date: entry.date instanceof Date 
        ? format(entry.date, 'yyyy-MM-dd')
        : format(new Date(entry.date), 'yyyy-MM-dd'),
      user: entry.user,
      source: entry.source,
      destination: entry.destination,
      cost: entry.cost,
      offline: entry.offline
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.user || !form.source || !form.destination || form.cost <= 0) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    if (currentId) {
      updateMutation.mutate({ id: currentId, data: form });
    } else {
      addMutation.mutate(form);
    }
  };

  const filteredAndSortedEntries = React.useMemo(() => {
    let result = [...entries];

    if (startDate && endDate) {
      result = result.filter(entry => {
        const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
        return isWithinInterval(entryDate, { 
          start: startOfDay(startDate), 
          end: endOfDay(endDate) 
        });
      });
    }

    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
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
  }, [entries, startDate, endDate, sortField, sortDirection]);

  const filteredTotalEarnings = filteredAndSortedEntries.reduce((sum, entry) => sum + entry.cost, 0);

  const toggleSort = (field: 'date' | 'cost') => {
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
          Earnings (Filtered Total: ₹{filteredTotalEarnings.toLocaleString()})
        </h2>
        <Button onClick={handleAdd} className="bg-primary text-white">
          + Add Offline Entry
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 p-6 shadow-md">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <Label htmlFor="user">Customer Name</Label>
                <Input
                  id="user"
                  value={form.user}
                  onChange={(e) => setForm({ ...form, user: e.target.value })}
                  placeholder="Customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  placeholder="Start location"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  placeholder="End location"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Amount (₹)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
                  placeholder="Enter amount"
                  min="0"
                  required
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
        <DateRangeFilter 
          startDate={startDate}
          endDate={endDate}
          onRangeChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        
        <div className="flex items-center space-x-2">
          <Select
            value={sortField}
            onValueChange={(value: 'date' | 'cost') => {
              setSortField(value);
              setSortDirection('desc');
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="cost">Amount</SelectItem>
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
          <span className="ml-3">Loading earnings...</span>
        </div>
      ) : filteredAndSortedEntries.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No earnings data yet</p>
          <p className="text-sm text-gray-500">Add your first entry using the button above</p>
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
              <TableHead>Customer</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => toggleSort('cost')}
              >
                Amount {sortField === 'cost' && (
                  sortDirection === 'asc' ? '↑' : '↓'
                )}
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {entry.date instanceof Date 
                    ? format(entry.date, 'dd MMM yyyy')
                    : format(new Date(entry.date), 'dd MMM yyyy')
                  }
                </TableCell>
                <TableCell>{entry.user}</TableCell>
                <TableCell>{entry.source}</TableCell>
                <TableCell>{entry.destination}</TableCell>
                <TableCell>₹{entry.cost.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${entry.offline ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {entry.offline ? 'Offline' : 'Online'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(entry)}
                      className="bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-700"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(entry.id!)}
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

export default EarningsTab;
