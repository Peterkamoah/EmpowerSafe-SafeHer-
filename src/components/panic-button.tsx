"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function PanicButton() {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timer | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const HOLD_TIME = 3000; // 3 seconds

  const startHolding = () => {
    if (timerRef.current) return;
    setIsHolding(true);
    setProgress(0);

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (HOLD_TIME / 100);
        if (newProgress >= 100) {
          clearInterval(progressIntervalRef.current!);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    timerRef.current = setTimeout(() => {
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      router.push("/panic");
    }, HOLD_TIME);
  };

  const stopHolding = () => {
    setIsHolding(false);
    setProgress(0);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const handleMouseUp = () => stopHolding();
    const handleTouchEnd = () => stopHolding();
    
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onMouseDown={startHolding}
        onTouchStart={(e) => {
          e.preventDefault();
          startHolding();
        }}
        className={cn(
          "relative flex h-48 w-48 items-center justify-center rounded-full border-8 border-destructive/20 bg-destructive/10 text-destructive transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-destructive/50",
          isHolding ? "scale-110 shadow-2xl" : "shadow-lg"
        )}
        aria-label="Panic Button: Press and hold for 3 seconds to activate"
      >
        <div
          className="absolute inset-0 rounded-full bg-destructive/30 transition-all duration-100"
          style={{ clipPath: `inset(${100 - progress}%)` }}
        />
        <div
          className="absolute inset-0 rounded-full border-8 border-destructive transition-all duration-100"
          style={{ transform: `scale(${progress / 100})`, opacity: progress > 0 ? 1 : 0 }}
        />
        <ShieldAlert className="z-10 h-24 w-24" />
      </button>
      <p className="font-body text-sm text-muted-foreground">
        Press and hold for 3 seconds to send an alert.
      </p>
    </div>
  );
}
