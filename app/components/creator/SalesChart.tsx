'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';

interface SalesChartProps {
  templates: Array<{
    orders: Array<{
      amount: number;
      createdAt: Date;
    }>;
  }>;
}

export function SalesChart({ templates }: SalesChartProps) {
  // Get last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      date: format(date, 'MMM dd'),
      sales: 0,
      revenue: 0,
    };
  });

  // Aggregate orders by date
  templates.forEach((template) => {
    template.orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const daysAgo = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysAgo >= 0 && daysAgo < 30) {
        const index = 29 - daysAgo;
        if (index >= 0 && index < last30Days.length) {
          last30Days[index].sales += 1;
          last30Days[index].revenue += order.amount - order.platformFee;
        }
      }
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={last30Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue ($)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
