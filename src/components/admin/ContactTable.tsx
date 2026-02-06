import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

interface ContactTableProps {
  contacts: Tables<'contact_submissions'>[];
  onRefresh: () => void;
}

export function ContactTable({ contacts, onRefresh }: ContactTableProps) {
  const [selectedContact, setSelectedContact] = useState<Tables<'contact_submissions'> | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const toggleReadStatus = async (contact: Tables<'contact_submissions'>) => {
    setUpdatingId(contact.id);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read: !contact.is_read })
        .eq('id', contact.id);

      if (error) throw error;
      toast.success(`Marked as ${!contact.is_read ? 'read' : 'unread'}`);
      onRefresh();
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewMessage = async (contact: Tables<'contact_submissions'>) => {
    setSelectedContact(contact);
    
    // Auto-mark as read when viewing
    if (!contact.is_read) {
      try {
        await supabase
          .from('contact_submissions')
          .update({ is_read: true })
          .eq('id', contact.id);
        onRefresh();
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No messages yet</h3>
        <p className="text-muted-foreground">Contact form submissions will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} className={!contact.is_read ? 'bg-muted/50' : ''}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>
                  {format(new Date(contact.submitted_at), 'MMM d, yyyy h:mm a')}
                </TableCell>
                <TableCell>
                  <Badge variant={contact.is_read ? 'secondary' : 'default'}>
                    {contact.is_read ? 'Read' : 'Unread'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewMessage(contact)}
                      title="View message"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleReadStatus(contact)}
                      disabled={updatingId === contact.id}
                      title={contact.is_read ? 'Mark as unread' : 'Mark as read'}
                    >
                      {contact.is_read ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4 text-primary" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-playfair">Message from {selectedContact?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{selectedContact?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p>
                {selectedContact && format(new Date(selectedContact.submitted_at), 'MMMM d, yyyy h:mm a')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Message</p>
              <p className="whitespace-pre-wrap">{selectedContact?.message}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
