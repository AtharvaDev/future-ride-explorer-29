
import React from 'react';
import { Car } from '@/data/cars';
import { Pencil, Trash2, ImagesIcon, MoveVertical } from 'lucide-react';
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
  CardFooter,
} from "@/components/ui/card";
import { UI_STRINGS } from '@/constants/uiStrings';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CarListProps {
  cars: Car[];
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
  onReorder: () => void;
  isLoading: boolean;
}

const CarList: React.FC<CarListProps> = ({ 
  cars, 
  onEdit, 
  onDelete,
  onReorder,
  isLoading 
}) => {
  // Sort cars by order field if it exists
  const sortedCars = [...cars].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    } else if (a.order !== undefined) {
      return -1;
    } else if (b.order !== undefined) {
      return 1;
    }
    return 0;
  });

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
              <TableHead>Order</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead>Price/Km</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCars.map((car, index) => (
              <TableRow key={car.id}>
                <TableCell className="text-center font-medium">
                  {car.order !== undefined ? car.order + 1 : '-'}
                </TableCell>
                <TableCell>
                  <div className="relative">
                    <img 
                      src={car.image} 
                      alt={car.title} 
                      className="w-16 h-12 object-contain"
                    />
                    {car.images && car.images.length > 1 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1">
                            <ImagesIcon className="h-3 w-3" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Has {car.images.length} images for carousel</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{car.id}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.title}</TableCell>
                <TableCell>₹{car.pricePerDay}</TableCell>
                <TableCell>₹{car.pricePerKm}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {car.insights && car.insights.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                        <span>{car.insights.length} insights</span>
                      </span>
                    )}
                    {car.features && car.features.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded">
                        <span>{car.features.length} features</span>
                      </span>
                    )}
                  </div>
                </TableCell>
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
      <CardFooter className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={onReorder} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <MoveVertical className="h-4 w-4" />
          <span>Reorder Vehicles</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarList;
