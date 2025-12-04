import { RatingStars } from '@/components/ui/RatingStars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    user: {
      firstName: string;
      lastName: string;
      username?: string;
      avatarUrl?: string;
      profileImage?: string;
    };
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const displayName = `${review.user.firstName} ${review.user.lastName}`;
  const initials = `${review.user.firstName[0]}${review.user.lastName[0]}`;
  const avatarUrl = review.user.avatarUrl || review.user.profileImage;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{displayName}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <RatingStars rating={review.rating} />
      </div>

      {review.comment && (
        <p className="text-sm text-foreground">{review.comment}</p>
      )}
    </div>
  );
}
