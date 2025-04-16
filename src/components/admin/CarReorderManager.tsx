import React, { useState } from 'react';
import { Car } from '@/data/cars';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface CarReorderManagerProps {
  cars: Car[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveOrder: (reorderedCars: Car[]) => void;
  isSaving: boolean;
}

const CarReorderManager: React.FC<CarReorderManagerProps> = ({
  cars,
  open,
  onOpenChange,
  onSaveOrder,
  isSaving
}) => {
  // Sort cars by order field, or if not present, keep original order
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

  const [orderedCars, setOrderedCars] = useState<Car[]>(sortedCars);

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(orderedCars);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for each car based on its new position
    const updatedItems = items.map((car, index) => ({
      ...car,
      order: index
    }));

    setOrderedCars(updatedItems);
  };

  const handleSave = () => {
    onSaveOrder(orderedCars);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reorder Vehicles</DialogTitle>
          <DialogDescription>
            Drag and drop vehicles to change their display order. Changes will be visible on the homepage.
          </DialogDescription>
        </DialogHeader>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="cars">
            {(provided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3 mt-4"
              >
                {orderedCars.map((car, index) => (
                  <Draggable 
                    key={car.id} 
                    draggableId={car.id} 
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="cursor-move hover:border-primary transition-colors duration-200"
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <ArrowUpDown className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-shrink-0 w-12 h-12">
                            <img 
                              src={car.image} 
                              alt={car.title} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium text-sm">{car.title}</p>
                            <p className="text-xs text-gray-500">{car.model}</p>
                          </div>
                          <div className="flex-shrink-0 bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center">
                            {index + 1}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="ml-2"
          >
            {isSaving ? 'Saving...' : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Order
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CarReorderManager;
