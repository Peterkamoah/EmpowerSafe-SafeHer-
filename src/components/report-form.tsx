"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

export function ReportForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep our community safe.",
      });
      router.push("/");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Incident Details</CardTitle>
        <CardDescription>
          Please provide as much information as you can.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Description of Incident</Label>
            <Textarea
              id="description"
              placeholder="Describe what happened..."
              rows={5}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Corner of Main St & 1st Ave"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="datetime">Date & Time</Label>
              <Input id="datetime" type="datetime-local" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="media">Upload Media (Photos/Videos)</Label>
            <Input id="media" type="file" className="file:text-primary file:font-semibold" />
            <p className="text-xs text-muted-foreground">Optional. Helps provide evidence.</p>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-4">
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous" className="flex flex-col">
              <span>Report Anonymously</span>
              <span className="text-xs font-normal text-muted-foreground">
                Your user ID will not be attached to this report.
              </span>
            </Label>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
