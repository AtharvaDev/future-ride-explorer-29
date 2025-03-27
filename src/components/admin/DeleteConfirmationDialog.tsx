
import React from 'react';
import { Car } from '@/data/cars';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car: Car | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  car,
  onConfirm,
  isDeleting
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{car?.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:space-x-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2"
            disabled={isDeleting}
          >
            <XCircle className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex items-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
