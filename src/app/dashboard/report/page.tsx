import { ReportForm } from '@/components/report-form';

export default function ReportPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Report an Incident
        </h1>
        <p className="mt-1 text-muted-foreground">
          Your contribution helps create a safer community. You can report anonymously.
        </p>
      </div>
      <ReportForm />
    </div>
  );
}
