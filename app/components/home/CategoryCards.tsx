'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import prisma from '@/app/lib/db';

interface CategoryCardsProps {
  categories: Array<{
    id: string;
    name: string;
    description?: string;
    icon?: string;
  }>;
}

export function CategoryCards({ categories }: CategoryCardsProps) {
  const categoryConfig = [
    {
      name: 'Marketing & Landing',
      description: 'Landing pages, marketing sites',
      icon: '🚀',
      href: '/templates?category=marketing-landing',
    },
    {
      name: 'Product & App UI',
      description: 'Application interfaces',
      icon: '📱',
      href: '/templates?category=product-app-ui',
    },
    {
      name: 'Dashboard & Analytics',
      description: 'Dashboards, analytics',
      icon: '📊',
      href: '/templates?category=dashboard-analytics',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Browse by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categoryConfig.map((category) => (
          <Link key={category.name} href={category.href}>
            <Card className="h-full hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div className="text-4xl mb-2">{category.icon}</div>
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-primary group-hover:gap-2 transition-all">
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
