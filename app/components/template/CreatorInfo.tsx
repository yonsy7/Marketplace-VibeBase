import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface CreatorInfoProps {
  creator: {
    id: string;
    username?: string;
    firstName: string;
    lastName: string;
    bio?: string;
    avatarUrl?: string;
    profileImage?: string;
  };
}

export function CreatorInfo({ creator }: CreatorInfoProps) {
  const avatarUrl = creator.avatarUrl || creator.profileImage;
  const displayName = `${creator.firstName} ${creator.lastName}`;
  const initials = `${creator.firstName[0]}${creator.lastName[0]}`;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">
              {creator.username ? (
                <Link
                  href={`/creator/${creator.username}`}
                  className="hover:underline"
                >
                  {displayName}
                </Link>
              ) : (
                displayName
              )}
            </h3>
            {creator.bio && (
              <p className="text-sm text-muted-foreground line-clamp-3">{creator.bio}</p>
            )}
            {creator.username && (
              <Link
                href={`/creator/${creator.username}`}
                className="text-sm text-primary hover:underline mt-2 inline-block"
              >
                View profile →
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
