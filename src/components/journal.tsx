
"use client";

import { useState, useEffect } from 'react';
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Loader, Trash2, Smile, Frown, Meh, SmilePlus, NotebookText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { format } from 'date-fns';

type Mood = 'Happy' | 'Okay' | 'Sad' | 'Other';

interface Entry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  createdAt: Date;
}

const moodIcons = {
  Happy: <Smile className="h-5 w-5 text-green-500" />,
  Okay: <Meh className="h-5 w-5 text-yellow-500" />,
  Sad: <Frown className="h-5 w-5 text-blue-500" />,
  Other: <SmilePlus className="h-5 w-5 text-gray-500" />,
};

const moodColors = {
  Happy: 'bg-green-100 border-green-200',
  Okay: 'bg-yellow-100 border-yellow-200',
  Sad: 'bg-blue-100 border-blue-200',
  Other: 'bg-gray-100 border-gray-200',
}

export function Journal() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [selectedMood, setSelectedMood] = useState<Mood>('Okay');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const mockUserId = "test-user-123";

  useEffect(() => {
    const q = query(collection(db, "users", mockUserId, "journal"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const journalEntries: Entry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        journalEntries.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
        } as Entry);
      });
      setEntries(journalEntries);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [mockUserId]);


  const handleCreateEntry = async () => {
    if (newEntry.title && newEntry.content) {
      setIsSubmitting(true);
      try {
        await addDoc(collection(db, "users", mockUserId, "journal"), {
          title: newEntry.title,
          content: newEntry.content,
          mood: selectedMood,
          createdAt: serverTimestamp(),
        });

        setNewEntry({ title: '', content: '' });
        setSelectedMood('Okay');
        setDialogOpen(false);
        toast({
          title: 'Entry Added',
          description: 'Your journal has been updated.',
        });
      } catch (error) {
        console.error("Error adding document: ", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not save your journal entry.',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
        await deleteDoc(doc(db, "users", mockUserId, "journal", id));
        toast({
            title: 'Entry Deleted',
            description: 'Your journal entry has been removed.',
        });
    } catch (error) {
        console.error("Error deleting document: ", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not delete the entry.',
        });
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Journal Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">New Journal Entry</DialogTitle>
              <DialogDescription>
                How are you feeling today?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="space-y-2">
                <Label>How are you feeling?</Label>
                <div className="flex gap-2">
                  {(Object.keys(moodIcons) as Mood[]).map((mood) => (
                    <Button
                      key={mood}
                      variant={selectedMood === mood ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setSelectedMood(mood)}
                      className="flex-col h-16 w-16"
                    >
                      {moodIcons[mood]}
                      <span className="text-xs mt-1">{mood}</span>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  placeholder="Today's Reflections"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={8}
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  placeholder="Write what's on your mind..."
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateEntry} disabled={isSubmitting}>
                {isSubmitting ? <Loader className="animate-spin" /> : 'Save Entry'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="text-center"><Loader className="animate-spin inline-block" /></div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <NotebookText className="mx-auto h-12 w-12" />
          <h3 className="mt-2 text-xl font-semibold">No journal entries yet</h3>
          <p className="mt-1">Click "New Journal Entry" to start writing.</p>
        </div>
      ) : (
         <div className="space-y-6">
          {entries.map((entry) => (
            <Card key={entry.id} className={`hover:shadow-md transition-shadow ${moodColors[entry.mood]}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">{entry.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-xs">
                           <span>{format(entry.createdAt, 'MMMM d, yyyy h:mm a')}</span>
                           <span className="flex items-center gap-1"> &middot; {moodIcons[entry.mood]} {entry.mood}</span>
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEntry(entry.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-body">
                  {entry.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
