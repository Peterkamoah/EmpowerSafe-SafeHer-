"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { GoogleIcon } from '@/components/icons';
import { auth, db } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Loader } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isGoogleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document already exists
      const userDocRef = doc(db, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create user document in Firestore
        await setDoc(userDocRef, {
          full_name: user.displayName,
          email: user.email,
        });
      }
      
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google. Please try again.',
        variant: 'destructive',
      });
      console.error("Google Sign-In Error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };


  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#F289B3_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
      <Card className="w-full max-w-md animate-fade-in-up shadow-2xl shadow-primary/10">
        <CardHeader className="items-center text-center">
          <Logo className="mb-2" />
          <CardDescription className="font-body">
            Your trusted partner in safety and support.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button size="lg" className="w-full font-bold" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
            {isGoogleLoading ? <Loader className="animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
            {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          <Button asChild variant="secondary" size="lg" className="w-full font-bold">
            <Link href="/dashboard">Continue with Email</Link>
          </Button>
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SafeHer. All rights reserved.</p>
      </footer>
    </main>
  );
}
