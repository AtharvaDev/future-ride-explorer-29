
import React from 'react';
import { Car } from '@/data/cars';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UI_STRINGS } from '@/constants/uiStrings';

interface CarListProps {
  cars: Car[];
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
  isLoading: boolean;
}

const CarList: React.FC<CarListProps> = ({ 
  cars, 
  onEdit, 
  onDelete, 
  isLoading 
}) => {
  return (
    <Card className="admin-card">
      <CardHeader>
        <CardTitle>{UI_STRINGS.ADMIN.CAR_LIST.TITLE}</CardTitle>
        <CardDescription>{UI_STRINGS.ADMIN.CAR_LIST.DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead>Price/Km</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>
                  <img 
                    src={car.image} 
                    alt={car.title} 
                    className="w-16 h-12 object-contain"
                  />
                </TableCell>
                <TableCell className="font-medium">{car.id}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.title}</TableCell>
                <TableCell>₹{car.pricePerDay}</TableCell>
                <TableCell>₹{car.pricePerKm}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(car)}
                      disabled={isLoading}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(car)}
                      disabled={isLoading}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CarList;
