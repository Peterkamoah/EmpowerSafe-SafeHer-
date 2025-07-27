
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
import { Send, Loader, MessageCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function ReportForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const datetime = formData.get("datetime") as string;
    
    // NOTE: Using a mock user ID since auth is disabled for testing
    const mockUserId = "test-user-123";

    try {
      let mediaUrl = null;

      // 1. Upload media if it exists
      if (mediaFile) {
        const storage = getStorage();
        const fileName = `${Date.now()}-${mediaFile.name}`;
        const storagePath = `reports/${isAnonymous ? 'anonymous' : mockUserId}/${fileName}`;
        const storageRef = ref(storage, storagePath);
        
        await uploadBytes(storageRef, mediaFile);
        mediaUrl = await getDownloadURL(storageRef);
      }

      // 2. Create document in Firestore
      await addDoc(collection(db, "reports"), {
        reportingUserId: isAnonymous ? null : mockUserId,
        description,
        location,
        incidentTimestamp: new Date(datetime),
        mediaUrl,
        isAnonymous,
        status: 'new',
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep our community safe.",
      });
      setReportSubmitted(true);

    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  if (reportSubmitted) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Thank You</CardTitle>
          <CardDescription>
            Your report has been submitted. Your courage helps make our community safer.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
            <p>If you need to talk to someone, we're here for you.</p>
            <Button onClick={() => router.push('/support-chat')}>
              <MessageCircle className="mr-2 h-5 w-5" />
              Speak to a Support Assistant
            </Button>
             <Button variant="outline" onClick={() => router.push('/')}>
              Return to Dashboard
            </Button>
        </CardContent>
      </Card>
    );
  }

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
              name="description"
              placeholder="Describe what happened..."
              rows={5}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Corner of Main St & 1st Ave"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="datetime">Date & Time</Label>
              <Input id="datetime" name="datetime" type="datetime-local" required disabled={isSubmitting}/>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="media">Upload Media (Photos/Videos)</Label>
            <Input 
              id="media" 
              type="file" 
              className="file:text-primary file:font-semibold" 
              onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">Optional. Helps provide evidence.</p>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-4">
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
              disabled={isSubmitting}
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
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
