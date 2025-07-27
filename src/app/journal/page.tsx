
import { Journal } from '@/components/journal';

export default function JournalPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Private Journal
        </h1>
        <p className="mt-1 text-muted-foreground">
          A safe space for your thoughts and feelings. Completely private.
        </p>
      </div>
      <Journal />
    </div>
  );
}
