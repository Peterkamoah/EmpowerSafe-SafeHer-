
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

type AuthStep = 'email' | 'signin' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setStep('signin');
      } else {
        setStep('signup');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not verify email. Please try again.',
        variant: 'destructive',
      });
      console.error('Email check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Sign-in Failed',
        description: 'Invalid password. Please try again.',
        variant: 'destructive',
      });
      console.error('Sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase auth profile
      await updateProfile(user, { displayName: fullName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'Users', user.uid), {
        full_name: fullName,
        email: user.email,
      });

      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Sign-up Failed',
        description: 'Could not create account. Please try again.',
        variant: 'destructive',
      });
      console.error('Sign-up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full font-bold" disabled={isLoading}>
              {isLoading ? <Loader className="animate-spin" /> : 'Continue'}
            </Button>
          </form>
        );
      case 'signin':
        return (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full font-bold" disabled={isLoading}>
              {isLoading ? <Loader className="animate-spin" /> : 'Sign In'}
            </Button>
          </form>
        );
      case 'signup':
        return (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Password</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
               <p className="text-xs text-muted-foreground">Must be at least 6 characters.</p>
            </div>
            <Button type="submit" className="w-full font-bold" disabled={isLoading}>
              {isLoading ? <Loader className="animate-spin" /> : 'Create Account'}
            </Button>
          </form>
        );
    }
  };
  
  const getTitle = () => {
    switch(step) {
        case 'email': return "Continue with Email";
        case 'signin': return "Welcome Back!";
        case 'signup': return "Create Your Account";
    }
  }

  const getDescription = () => {
    switch(step) {
        case 'email': return "Enter your email to sign in or create an account.";
        case 'signin': return `Enter your password to sign in as ${email}`;
        case 'signup': return "Let's get you set up with a new account.";
    }
  }

  return (
     <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
       <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#F289B3_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        <Card className="w-full max-w-md animate-fade-in-up shadow-2xl shadow-primary/10">
            <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                     {step !== 'email' && (
                        <Button variant="ghost" size="icon" onClick={() => setStep('email')}>
                            <ArrowLeft />
                        </Button>
                     )}
                    <Logo className={step !== 'email' ? 'text-2xl' : ''}/>
                </div>
                <CardTitle className="font-headline text-2xl">{getTitle()}</CardTitle>
                <CardDescription>{getDescription()}</CardDescription>
            </CardHeader>
            <CardContent>
                {renderStep()}
            </CardContent>
        </Card>
        <footer className="mt-8 text-center text-sm text-muted-foreground">
             <Button variant="link" asChild>
                <Link href="/">Back to main screen</Link>
             </Button>
        </footer>
     </main>
  )
}
