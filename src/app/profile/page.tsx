import { EmergencyContacts } from '@/components/emergency-contacts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Profile & Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account and safety settings.
        </p>
      </div>
      <EmergencyContacts />
    </div>
  );
}
