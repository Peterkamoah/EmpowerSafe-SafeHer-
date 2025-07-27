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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, UserCircle, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from './ui/switch';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  comments: number;
  timestamp: string;
}

const initialPosts: Post[] = [
  {
    id: 1,
    title: 'Feeling grateful for this community',
    content: 'Just wanted to share a positive story. I used one of the tips shared here last week about sharing my live location with a friend when walking home late, and it made me feel so much safer...',
    author: 'Sarah J.',
    isAnonymous: false,
    comments: 12,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    title: 'Tips for solo travel?',
    content: 'Hi everyone, I\'m planning my first solo trip and feeling a bit nervous. Does anyone have safety tips or recommendations for apps/tools to use while traveling alone?',
    author: 'Anonymous',
    isAnonymous: true,
    comments: 28,
    timestamp: '1 day ago',
  },
];

export function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isAnonymousPost, setAnonymousPost] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      const post: Post = {
        ...newPost,
        id: Date.now(),
        author: isAnonymousPost ? 'Anonymous' : 'You',
        isAnonymous: isAnonymousPost,
        comments: 0,
        timestamp: 'Just now',
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '' });
      setAnonymousPost(false);
      setDialogOpen(false);
      toast({
        title: 'Post Created',
        description: 'Your post has been shared with the community.',
      });
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Create a New Post</DialogTitle>
              <DialogDescription>
                Share your thoughts with the community.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="A descriptive title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={6}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Share your story or question..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous-post"
                  checked={isAnonymousPost}
                  onCheckedChange={setAnonymousPost}
                />
                <Label htmlFor="anonymous-post">Post Anonymously</Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreatePost}>Post</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline">{post.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-xs">
                <UserCircle className="h-4 w-4" />
                <span>By {post.author}</span>
                <span>&middot;</span>
                <span>{post.timestamp}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-body">
                {post.content}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments} comments</span>
                </div>
                <Button variant="ghost" size="sm">Read More</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
