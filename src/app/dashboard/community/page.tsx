import { CommunityFeed } from '@/components/community-feed';

export default function CommunityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Community Space
        </h1>
        <p className="mt-1 text-muted-foreground">
          Share stories, ask for advice, and support one another.
        </p>
      </div>
      <CommunityFeed />
    </div>
  );
}
