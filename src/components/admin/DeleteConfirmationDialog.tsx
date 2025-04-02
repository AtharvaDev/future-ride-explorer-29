
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
import { UI_STRINGS } from '@/constants/uiStrings';

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
          <DialogTitle className="text-destructive">{UI_STRINGS.ADMIN.CONFIRM_DELETE.TITLE}</DialogTitle>
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
            {UI_STRINGS.ADMIN.CONFIRM_DELETE.CANCEL}
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
                {UI_STRINGS.ADMIN.CONFIRM_DELETE.DELETING}
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                {UI_STRINGS.ADMIN.CONFIRM_DELETE.DELETE}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
