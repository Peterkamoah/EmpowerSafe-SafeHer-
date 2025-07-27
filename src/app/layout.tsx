
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, UserCircle, LogOut, NotebookText } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/community", icon: MessageSquare, label: "Community" },
  { href: "/journal", icon: NotebookText, label: "Journal" },
  { href: "/profile", icon: UserCircle, label: "Profile" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    // For now, this just navigates to the home page since auth is disabled
    router.push('/');
  }

  const mockUser = {
      displayName: 'Test User',
      photoURL: 'https://placehold.co/40x40.png',
  }

  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} className="w-full">
                      <SidebarMenuButton
                        isActive={pathname === item.href}
                        tooltip={item.label}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <div className="flex flex-col gap-2 p-2">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={mockUser.photoURL || "https://placehold.co/40x40.png"}
                        alt={mockUser.displayName || "User avatar"}
                        data-ai-hint="woman portrait"
                      />
                      <AvatarFallback>{mockUser.displayName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm group-data-[collapsible=icon]:hidden">
                      <span className="font-semibold text-sidebar-foreground">
                        {mockUser.displayName || 'User'}
                      </span>
                    </div>
                </div>
                 <Button variant="ghost" size="sm" className="justify-start group-data-[collapsible=icon]:justify-center" onClick={handleSignOut}>
                    <LogOut />
                    <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
                 </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-background/50 px-6 backdrop-blur-sm md:hidden">
              <SidebarTrigger />
              <Logo className="text-2xl" />
            </header>
            <main className="flex-1 p-4 sm:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
