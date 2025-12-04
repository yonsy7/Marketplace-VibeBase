'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from '@/app/components/ui/RatingStars';
import { Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
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

interface ReviewsTableProps {
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    template: {
      id: string;
      title: string;
      slug: string;
    };
  }>;
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (reviewId: string) => {
    setDeletingId(reviewId);
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      toast.success('Review deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {review.user.firstName} {review.user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{review.user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <a
                  href={`/templates/${review.template.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {review.template.title}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </TableCell>
              <TableCell>
                <RatingStars rating={review.rating} size="sm" />
              </TableCell>
              <TableCell className="max-w-md">
                <p className="text-sm line-clamp-2">{review.comment || 'No comment'}</p>
              </TableCell>
              <TableCell>
                {new Date(review.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingId === review.id}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Review</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this review? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(review.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
