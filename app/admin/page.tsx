import { requireAdmin } from '@/app/lib/auth';
import { GlobalStats } from '@/app/components/admin/GlobalStats';
import { PendingTemplates } from '@/app/components/admin/PendingTemplates';
import { RecentActivity } from '@/app/components/admin/RecentActivity';

export const metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminDashboard() {
  await requireAdmin();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage templates, reviews, and platform statistics
        </p>
      </div>

      <GlobalStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PendingTemplates />
        <RecentActivity />
      </div>
    </div>
  );
}
