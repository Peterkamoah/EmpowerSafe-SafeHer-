import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PanicButton } from '@/components/panic-button';
import { FileText } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center">
      <div className="animate-fade-in-up">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
          Safety Hub
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your central point for safety actions and support.
        </p>
      </div>

      <Card className="w-full max-w-sm animate-fade-in-up [animation-delay:0.2s]">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            Emergency Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PanicButton />
        </CardContent>
      </Card>

      <div className="w-full max-w-sm animate-fade-in-up [animation-delay:0.4s]">
        <Button asChild size="lg" variant="outline" className="w-full font-bold">
          <Link href="/dashboard/report">
            <FileText className="mr-2 h-5 w-5" />
            Report an Incident
          </Link>
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Your report can be anonymous and helps keep the community safe.
        </p>
      </div>
    </div>
  );
}
