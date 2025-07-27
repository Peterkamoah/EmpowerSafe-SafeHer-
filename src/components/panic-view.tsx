"use client";

import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/use-location";
import { Loader, MapPin, Siren } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function PanicView() {
  const { location, error } = useLocation();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);


  const handleEndAlert = () => {
    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
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
          Alert sent. Your camera is recording.
        </p>
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg bg-background/10 p-6 backdrop-blur-sm">
        
        <video ref={videoRef} className="w-full aspect-video rounded-md bg-background/20" autoPlay muted playsInline />
        {hasCameraPermission === false && (
          <Alert variant="destructive" className="mt-4 text-left">
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              Please allow camera access to record evidence. Check your browser settings.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2 text-lg mt-4">
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
              <span>Acquiring location...</span>
            </div>
          )}
        </div>
      </div>

      <Button onClick={handleEndAlert} size="lg" variant="secondary" className="w-full max-w-md font-bold text-destructive">
        End Alert
      </Button>
    </div>
  );
}
