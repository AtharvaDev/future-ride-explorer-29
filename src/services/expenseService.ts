
import { db } from '@/config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  serverTimestamp 
} from 'firebase/firestore';

export interface ExpenseEntry {
  id?: string;
  date: string | Date;
  type: string; // 'Fuel', 'Salary', 'EMI', 'Car Damage', 'Insurance', 'Other'
  amount: number;
  description?: string;
  vehicleId?: string; // Added vehicleId field
  createdAt?: Date | Timestamp;
}

/**
 * Get all expense entries
 */
export const getAllExpenses = async (vehicleId?: string): Promise<ExpenseEntry[]> => {
  try {
    const expensesRef = collection(db, 'Expenses');
    let q;
    
    if (vehicleId && vehicleId !== 'all') {
      q = query(expensesRef, where('vehicleId', '==', vehicleId), orderBy('date', 'desc'));
    } else {
      q = query(expensesRef, orderBy('date', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
        type: data.type,
        amount: data.amount,
        description: data.description,
        vehicleId: data.vehicleId,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
      };
    });
  } catch (error) {
    console.error("Error getting expenses:", error);
    throw error;
  }
};

/**
 * Add a new expense entry
 */
export const addExpense = async (expense: Omit<ExpenseEntry, 'id'>): Promise<string> => {
  try {
    const expenseData = {
      ...expense,
      date: expense.date instanceof Date ? Timestamp.fromDate(expense.date) : Timestamp.fromDate(new Date(expense.date)),
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'Expenses'), expenseData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

/**
 * Update an existing expense entry
 */
export const updateExpense = async (id: string, updates: Partial<ExpenseEntry>): Promise<void> => {
  try {
    const expenseRef = doc(db, 'Expenses', id);
    
    const updateData: any = { ...updates };
    if (updates.date) {
      updateData.date = updates.date instanceof Date 
        ? Timestamp.fromDate(updates.date) 
        : Timestamp.fromDate(new Date(updates.date));
    }
    
    await updateDoc(expenseRef, updateData);
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

/**
 * Delete an expense entry
 */
export const deleteExpense = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'Expenses', id));
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

/**
 * Get expenses in a date range
 */
export const getExpensesByDateRange = async (
  startDate: Date, 
  endDate: Date,
  vehicleId?: string
): Promise<ExpenseEntry[]> => {
  try {
    const expensesRef = collection(db, 'Expenses');
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);
    
    let q;
    
    if (vehicleId && vehicleId !== 'all') {
      q = query(
        expensesRef,
        where('vehicleId', '==', vehicleId),
        where('date', '>=', startTimestamp), 
        where('date', '<=', endTimestamp),
        orderBy('date', 'desc')
      );
    } else {
      q = query(
        expensesRef, 
        where('date', '>=', startTimestamp), 
        where('date', '<=', endTimestamp),
        orderBy('date', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
        type: data.type,
        amount: data.amount,
        description: data.description,
        vehicleId: data.vehicleId
      };
    });
  } catch (error) {
    console.error("Error getting expenses by date range:", error);
    throw error;
  }
};

/**
 * Get expenses summarized by type in a date range
 * Returns an array of { type, totalAmount }
 */
export const getExpensesSummaryByType = async (startDate: Date, endDate: Date): Promise<{ type: string, totalAmount: number }[]> => {
  try {
    const expenses = await getExpensesByDateRange(startDate, endDate);
    
    // Group by type and calculate totals
    const summary = expenses.reduce((acc: Record<string, number>, expense) => {
      const { type, amount } = expense;
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += amount;
      return acc;
    }, {});
    
    // Convert to array format
    return Object.entries(summary).map(([type, totalAmount]) => ({
      type,
      totalAmount
    }));
  } catch (error) {
    console.error("Error getting expenses summary by type:", error);
    throw error;
  }
};
