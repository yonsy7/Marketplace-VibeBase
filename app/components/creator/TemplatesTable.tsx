'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, ExternalLink } from 'lucide-react';
import { formatPrice } from '@/app/lib/utils';
import { TemplateStatus } from '@prisma/client';

interface TemplatesTableProps {
  templates: Array<{
    id: string;
    slug: string;
    title: string;
    status: TemplateStatus;
    price: number;
    viewCount: number;
    ratingAverage: number;
    likeCount: number;
    _count: {
      orders: number;
      reviews: number;
      favorites: number;
    };
    orders: Array<{
      amount: number;
      platformFee: number;
    }>;
  }>;
}

export function TemplatesTable({ templates }: TemplatesTableProps) {
  const [filter, setFilter] = useState<TemplateStatus | 'ALL'>('ALL');

  const filteredTemplates =
    filter === 'ALL'
      ? templates
      : templates.filter((t) => t.status === filter);

  const getRevenue = (template: TemplatesTableProps['templates'][0]) => {
    return template.orders.reduce((sum, o) => sum + (o.amount - o.platformFee), 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Templates</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('ALL')}
          >
            All
          </Button>
          <Button
            variant={filter === 'DRAFT' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('DRAFT')}
          >
            Draft
          </Button>
          <Button
            variant={filter === 'PENDING' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('PENDING')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'PUBLISHED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('PUBLISHED')}
          >
            Published
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No templates found
                </TableCell>
              </TableRow>
            ) : (
              filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={template.status} />
                  </TableCell>
                  <TableCell>{formatPrice(template.price)}</TableCell>
                  <TableCell>{template.viewCount}</TableCell>
                  <TableCell>{template._count.orders}</TableCell>
                  <TableCell>{formatPrice(getRevenue(template))}</TableCell>
                  <TableCell>
                    {template.ratingAverage > 0 ? (
                      <span>{template.ratingAverage.toFixed(1)}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{template.likeCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Link href={`/templates/${template.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Link href={`/creator/templates/${template.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          // TODO: Implement delete
                          console.log('Delete template:', template.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
