"use client";

import type React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { User, Shield, Activity } from "lucide-react";
import SecurityForm from "./components/security-form";
import ActivityList from "./components/activity-list";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  // Get the tab from the URL or default to "profile"
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["profile", "security", "activity"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Update the URL when the tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/profile?tab=${value}`, { scroll: false });
  };

  return (
    <div className="bg-gradient-to-br from-background to-background/90 min-h-screen">
      <div className="container mx-auto py-20 pt-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Activity</span>
              </TabsTrigger>
            </TabsList>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <TabsContent value="profile">
                {activeTab === "profile" && children}
              </TabsContent>
              <TabsContent value="security">
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Security</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your account security and password.
                      </p>
                    </div>
                    <SecurityForm />
                  </div>
                )}
              </TabsContent>
              <TabsContent value="activity">
                {activeTab === "activity" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Activity</h3>
                      <p className="text-sm text-muted-foreground">
                        View your recent account activity and login history.
                      </p>
                    </div>
                    <ActivityList />
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
