import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { Package, Mail, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalProducts: number;
  availableProducts: number;
  soldOutProducts: number;
  totalSubscribers: number;
  unreadContacts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    availableProducts: 0,
    soldOutProducts: 0,
    totalSubscribers: 0,
    unreadContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch products count
        const { count: totalProducts } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        const { count: availableProducts } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('is_available', true);

        // Fetch subscribers count
        const { count: totalSubscribers } = await supabase
          .from('newsletter_subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        // Fetch unread contacts count
        const { count: unreadContacts } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);

        setStats({
          totalProducts: totalProducts || 0,
          availableProducts: availableProducts || 0,
          soldOutProducts: (totalProducts || 0) - (availableProducts || 0),
          totalSubscribers: totalSubscribers || 0,
          unreadContacts: unreadContacts || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-playfair font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your greenhouse.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Products"
            value={loading ? '...' : stats.totalProducts}
            description="All plants in inventory"
            icon={Package}
          />
          <StatsCard
            title="Available"
            value={loading ? '...' : stats.availableProducts}
            description="Plants ready to sell"
            icon={CheckCircle}
          />
          <StatsCard
            title="Newsletter Subscribers"
            value={loading ? '...' : stats.totalSubscribers}
            description="Active subscribers"
            icon={Mail}
          />
          <StatsCard
            title="Unread Messages"
            value={loading ? '...' : stats.unreadContacts}
            description="Contact form submissions"
            icon={MessageSquare}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-playfair text-lg font-semibold mb-2">Inventory Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available products</span>
                <span className="font-medium">{stats.availableProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sold out products</span>
                <span className="font-medium">{stats.soldOutProducts}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-playfair text-lg font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                • Add new products in the <span className="font-medium text-foreground">Products</span> section
              </p>
              <p className="text-muted-foreground">
                • View subscriber emails in <span className="font-medium text-foreground">Subscribers</span>
              </p>
              <p className="text-muted-foreground">
                • Read customer messages in <span className="font-medium text-foreground">Contacts</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
