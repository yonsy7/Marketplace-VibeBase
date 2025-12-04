import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { RatingStars } from '@/components/ui/RatingStars';
import { Package, ShoppingCart, Heart, Star } from 'lucide-react';

interface PublicProfileProps {
  creator: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    bio?: string | null;
    avatarUrl?: string | null;
  };
  stats: {
    templateCount: number;
    totalSales: number;
    totalLikes: number;
    avgRating: number;
  };
}

export function PublicProfile({ creator, stats }: PublicProfileProps) {
  const displayName = `${creator.firstName} ${creator.lastName}`;
  const initials = `${creator.firstName[0]}${creator.lastName[0]}`;

  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={creator.avatarUrl || ''} alt={displayName} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
              {creator.bio && (
                <p className="text-muted-foreground">{creator.bio}</p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stats.templateCount}</p>
                  <p className="text-xs text-muted-foreground">Templates</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalSales}</p>
                  <p className="text-xs text-muted-foreground">Sales</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalLikes}</p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
              </div>

              {stats.avgRating > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
                      <RatingStars rating={stats.avgRating} size="sm" />
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
