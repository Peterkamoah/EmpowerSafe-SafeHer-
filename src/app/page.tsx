import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { GoogleIcon } from '@/components/icons';

export default function WelcomePage() {
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
          <Button asChild size="lg" className="w-full font-bold">
            <Link href="/dashboard">
              <GoogleIcon className="mr-2 h-5 w-5" />
              Sign in with Google
            </Link>
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
