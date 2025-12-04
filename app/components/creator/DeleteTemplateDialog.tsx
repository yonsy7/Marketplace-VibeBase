'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteTemplate } from '@/app/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface DeleteTemplateDialogProps {
  templateId: string;
  templateTitle: string;
  hasSales: boolean;
}

export function DeleteTemplateDialog({ templateId, templateTitle, hasSales }: DeleteTemplateDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (hasSales) {
      toast.error('Cannot delete template with existing sales');
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      await deleteTemplate(templateId);
      toast.success('Template deleted successfully');
      router.push('/creator/templates');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete template');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={hasSales}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Template</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{templateTitle}"? This action cannot be undone.
            {hasSales && (
              <span className="block mt-2 text-destructive font-medium">
                This template has sales and cannot be deleted.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading || hasSales}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
