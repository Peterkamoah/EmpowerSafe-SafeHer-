"use client";

import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/use-location";
import { Loader, MapPin, Siren } from "lucide-react";
import { useRouter } from "next/navigation";

export function PanicView() {
  const { location, error } = useLocation();
  const router = useRouter();

  const handleEndAlert = () => {
    router.push("/");
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-between p-8 text-center bg-destructive text-destructive-foreground animate-pulse-bg">
      <style jsx>{`
        @keyframes pulse-bg {
          0% {
            background-color: hsl(var(--destructive));
          }
          50% {
            background-color: hsl(0 75% 40%);
          }
          100% {
            background-color: hsl(var(--destructive));
          }
        }
        .animate-pulse-bg {
          animation: pulse-bg 2s infinite;
        }
      `}</style>
      
      <div className="flex flex-col items-center">
        <Siren className="h-20 w-20 animate-ping" />
        <h1 className="mt-4 font-headline text-4xl font-bold uppercase tracking-widest md:text-6xl">
          Panic Mode
        </h1>
        <p className="mt-2 text-lg opacity-90">
          Alert sent to your emergency contacts. Help is on the way.
        </p>
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg bg-background/10 p-6 backdrop-blur-sm">
        <h2 className="font-headline text-2xl font-semibold">Your Location</h2>
        <div className="flex items-center gap-2 text-lg">
          <MapPin className="h-6 w-6" />
          {error ? (
            <span className="text-yellow-300">{error}</span>
          ) : location ? (
            <span className="font-mono">
              {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <Loader className="h-5 w-5 animate-spin" />
              <span>Acquiring signal...</span>
            </div>
          )}
        </div>
        <div className="h-32 w-full rounded-md bg-background/20 flex items-center justify-center text-sm opacity-80">
          Map will be displayed here
        </div>
      </div>

      <Button onClick={handleEndAlert} size="lg" variant="secondary" className="w-full max-w-md font-bold text-destructive">
        End Alert
      </Button>
    </div>
  );
}
