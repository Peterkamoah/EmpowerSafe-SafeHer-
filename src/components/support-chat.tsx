
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Bot, Loader, Send, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supportChat } from '@/ai/flows/support-chat-flow';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';


interface Message {
  role: 'user' | 'bot';
  content: string;
}

export function SupportChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Hello. I'm a support assistant here to help. I want to start by saying thank you for coming forward. It takes courage to report an incident, and I want you to know that you're in a safe space. How can I help you right now?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await supportChat(input);
      const botMessage: Message = { role: 'bot', content: response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("AI chat error:", error);
      const errorMessage: Message = { role: 'bot', content: 'I apologize, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[70vh]">
      <CardHeader>
          {/* Header can be used for bot info if needed */}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'bot' && (
                   <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                      <AvatarFallback><Bot /></AvatarFallback>
                   </Avatar>
                )}
                 <div className={cn(
                    "max-w-[75%] rounded-lg p-3 text-sm",
                    message.role === 'user' 
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                 )}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                 </div>
                 {message.role === 'user' && (
                   <Avatar className="h-8 w-8">
                       <AvatarFallback><User /></AvatarFallback>
                   </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                    <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                    <Loader className="animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
