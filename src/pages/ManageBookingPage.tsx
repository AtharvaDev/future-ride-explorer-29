
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTabsState } from '@/hooks/use-tabs-state';
import BookingManagementTab from '@/pages/manage-booking/BookingManagementTab';
import EarningsTab from '@/pages/manage-booking/EarningsTab';
import ExpensesTab from '@/pages/manage-booking/ExpensesTab';
import InsightsTab from '@/pages/manage-booking/InsightsTab';
import VehiclesTab from '@/pages/manage-booking/VehiclesTab';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const tabOptions = [
  { value: 'manage', label: 'Manage Bookings' },
  { value: 'vehicles', label: 'My Vehicles' },
  { value: 'earnings', label: 'Earnings' },
  { value: 'expenses', label: 'Expenses' },
  { value: 'insights', label: 'Insights' }
];

const ManageBookingPage: React.FC = () => {
  const { activeTab, setTab } = useTabsState(tabOptions[0].value);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("all");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Admin: Manage Bookings</h1>
        <Tabs value={activeTab} onValueChange={setTab}>
          <TabsList className="flex space-x-4 mb-6">
            {tabOptions.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="px-4 py-2 rounded text-lg bg-muted hover:bg-gray-100"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="manage">
            <BookingManagementTab />
          </TabsContent>
          <TabsContent value="vehicles">
            <VehiclesTab />
          </TabsContent>
          <TabsContent value="earnings">
            <EarningsTab selectedVehicleId={selectedVehicleId} onVehicleChange={setSelectedVehicleId} />
          </TabsContent>
          <TabsContent value="expenses">
            <ExpensesTab selectedVehicleId={selectedVehicleId} onVehicleChange={setSelectedVehicleId} />
          </TabsContent>
          <TabsContent value="insights">
            <InsightsTab selectedVehicleId={selectedVehicleId} onVehicleChange={setSelectedVehicleId} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ManageBookingPage;
