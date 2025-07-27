"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  id: number;
  name: string;
  phone: string;
}

const initialContacts: Contact[] = [
  { id: 1, name: 'Jane Doe', phone: '555-123-4567' },
  { id: 2, name: 'Mom', phone: '555-987-6543' },
];

export function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([
        ...contacts,
        { ...newContact, id: Date.now() },
      ]);
      setNewContact({ name: '', phone: '' });
      setDialogOpen(false);
      toast({
        title: 'Contact Added',
        description: `${newContact.name} has been added to your emergency contacts.`,
      });
    }
  };

  const handleDeleteContact = (id: number) => {
    const contactToDelete = contacts.find(c => c.id === id);
    setContacts(contacts.filter((contact) => contact.id !== id));
    toast({
      title: 'Contact Removed',
      description: `${contactToDelete?.name} has been removed.`,
      variant: 'destructive'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="font-headline text-2xl">Emergency Contacts</CardTitle>
                <CardDescription>People to notify in an emergency.</CardDescription>
            </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Enter the name and phone number of your emergency contact.
              </DialogDescription>
            </Header>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="col-span-3"
                  placeholder="555-123-4567"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddContact}>Save Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                        No emergency contacts yet.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
