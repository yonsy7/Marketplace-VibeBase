import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Star, Heart, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/app/lib/utils';

interface StatsCardsProps {
  totalSales: number;
  totalRevenue: number;
  totalGrossRevenue: number;
  avgRating: number;
  totalFavorites: number;
}

export function StatsCards({
  totalSales,
  totalRevenue,
  totalGrossRevenue,
  avgRating,
  totalFavorites,
}: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Sales',
      value: totalSales.toString(),
      icon: ShoppingCart,
      description: 'Total orders',
    },
    {
      title: 'Gross Revenue',
      value: formatPrice(totalGrossRevenue),
      icon: DollarSign,
      description: 'Before fees',
    },
    {
      title: 'Net Revenue',
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      description: 'After platform fee',
    },
    {
      title: 'Average Rating',
      value: avgRating > 0 ? avgRating.toFixed(1) : '0.0',
      icon: Star,
      description: 'Across all templates',
    },
    {
      title: 'Total Favorites',
      value: totalFavorites.toString(),
      icon: Heart,
      description: 'Likes received',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
