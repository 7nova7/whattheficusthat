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
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Mail, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

interface SubscriberTableProps {
  subscribers: Tables<'newsletter_subscribers'>[];
  onRefresh: () => void;
}

export function SubscriberTable({ subscribers, onRefresh }: SubscriberTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Subscriber ${!currentStatus ? 'activated' : 'deactivated'}`);
      onRefresh();
    } catch (error) {
      console.error('Error updating subscriber:', error);
      toast.error('Failed to update subscriber status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (subscribers.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No subscribers yet</h3>
        <p className="text-muted-foreground">Subscribers will appear here when people sign up.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Subscribed Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="font-medium">{subscriber.email}</TableCell>
                <TableCell>
                  {format(new Date(subscriber.subscribed_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge variant={subscriber.is_active ? 'default' : 'secondary'}>
                    {subscriber.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={subscriber.is_active}
                    onCheckedChange={() => toggleStatus(subscriber.id, subscriber.is_active)}
                    disabled={updatingId === subscriber.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredSubscribers.length === 0 && searchTerm && (
        <p className="text-center text-muted-foreground py-4">
          No subscribers found matching "{searchTerm}"
        </p>
      )}
    </div>
  );
}
