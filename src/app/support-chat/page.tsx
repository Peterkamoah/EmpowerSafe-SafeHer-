
import { SupportChat } from '@/components/support-chat';

export default function SupportChatPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Support Assistant
        </h1>
        <p className="mt-1 text-muted-foreground">
          You are now connected with an AI-powered support assistant.
        </p>
      </div>
      <SupportChat />
    </div>
  );
}
