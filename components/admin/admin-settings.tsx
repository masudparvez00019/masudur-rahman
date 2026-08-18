"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Settings {
  _id?: string;
  fullName: string;
  email: string;
  bio: string;
  location: string;
  profileImage?: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
  appearance: {
    accentColor: string;
    defaultTheme: string;
    enableAnimations: boolean;
    enableParticles: boolean;
  };
  emailSettings: {
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPass: string;
    emailFrom: string;
    emailTo: string;
    enableNotifications: boolean;
  };
}

const defaultSettings: Settings = {
  fullName: "",
  email: "",
  bio: "",
  location: "",
  profileImage: "",
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
  },
  appearance: {
    accentColor: "#7c3aed",
    defaultTheme: "dark",
    enableAnimations: true,
    enableParticles: true,
  },
  emailSettings: {
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
    emailFrom: "",
    emailTo: "",
    enableNotifications: true,
  },
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        const data = await response.json();

        if (data) {
          setSettings({
            ...defaultSettings, // Start with default settings to ensure all properties exist
            ...data, // Overwrite with API data
            // Ensure nested objects are properly initialized
            socialLinks: {
              ...defaultSettings.socialLinks,
              ...data.socialLinks,
            },
            appearance: {
              ...defaultSettings.appearance,
              ...data.appearance,
            },
            emailSettings: {
              ...defaultSettings.emailSettings, // ✅ Fixed: Use emailSettings
              ...data.emailSettings, // ✅ Fixed: Use emailSettings
            },
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Failed to load settings. Please try again.");
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleGeneralChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setSettings({ ...settings, [id]: value });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings({
      ...settings,
      socialLinks: {
        ...settings.socialLinks,
        [id]: value,
      },
    });
  };

  const handleAppearanceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [id]: value,
      },
    });
  };

  const handleAppearanceSwitchChange = (id: string, checked: boolean) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [id]: checked,
      },
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings({
      ...settings,
      emailSettings: {
        ...settings.emailSettings,
        [id]: value,
      },
    });
  };

  const handleEmailSwitchChange = (checked: boolean) => {
    setSettings({
      ...settings,
      emailSettings: {
        ...settings.emailSettings,
        enableNotifications: checked,
      },
    });
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        defaultTheme: e.target.value,
      },
    });
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server response:", response.status, errorData);
        throw new Error(
          `Failed to save settings: ${response.status} ${response.statusText}`
        );
      }

      toast.success("Your settings have been saved successfully.");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to save settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="social">Social Media</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Manage your profile and personal information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveSettings} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={settings.fullName}
                    onChange={handleGeneralChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={handleGeneralChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    className="min-h-[100px]"
                    value={settings.bio}
                    onChange={handleGeneralChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={settings.location}
                    onChange={handleGeneralChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profile Picture URL</Label>
                  <Input
                    id="profileImage"
                    value={settings.profileImage}
                    onChange={handleGeneralChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="social">
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>
              Manage your social media profiles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveSettings} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={settings.socialLinks.github}
                    onChange={handleSocialChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={settings.socialLinks.linkedin}
                    onChange={handleSocialChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={settings.socialLinks.twitter}
                    onChange={handleSocialChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Personal Website</Label>
                  <Input
                    id="website"
                    value={settings.socialLinks.website}
                    onChange={handleSocialChange}
                  />
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>Appearance Settings</CardTitle>
            <CardDescription>
              Customize how your portfolio looks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveSettings} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      className="w-24 h-10"
                      value={settings.appearance.accentColor}
                      onChange={handleAppearanceChange}
                    />
                    <span className="text-sm text-muted-foreground">
                      {settings.appearance.accentColor}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor="defaultTheme" className="mb-1 block">
                      Default Theme
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Set the default theme for your portfolio.
                    </p>
                  </div>
                  <select
                    id="defaultTheme"
                    className="p-2 rounded-md border border-input"
                    value={settings.appearance.defaultTheme}
                    onChange={handleThemeChange}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor="enableAnimations" className="mb-1 block">
                      Enable Animations
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable animations and transitions throughout your
                      portfolio.
                    </p>
                  </div>
                  <Switch
                    id="enableAnimations"
                    checked={settings.appearance.enableAnimations}
                    onCheckedChange={(checked) =>
                      handleAppearanceSwitchChange("enableAnimations", checked)
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor="enableParticles" className="mb-1 block">
                      Enable Particle Effects
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable background particle effects on the homepage.
                    </p>
                  </div>
                  <Switch
                    id="enableParticles"
                    checked={settings.appearance.enableParticles}
                    onCheckedChange={(checked) =>
                      handleAppearanceSwitchChange("enableParticles", checked)
                    }
                  />
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>
              Configure email settings for the contact form.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveSettings} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    placeholder="smtp.example.com"
                    value={settings.emailSettings.smtpHost}
                    onChange={handleEmailChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    placeholder="587"
                    value={settings.emailSettings.smtpPort}
                    onChange={handleEmailChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    placeholder="username"
                    value={settings.emailSettings.smtpUser}
                    onChange={handleEmailChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPass">SMTP Password</Label>
                  <Input
                    id="smtpPass"
                    type="password"
                    placeholder="••••••••"
                    value={settings.emailSettings.smtpPass}
                    onChange={handleEmailChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailFrom">From Email</Label>
                  <Input
                    id="emailFrom"
                    placeholder="contact@example.com"
                    value={settings.emailSettings.emailFrom}
                    onChange={handleEmailChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailTo">To Email</Label>
                  <Input
                    id="emailTo"
                    placeholder="you@example.com"
                    value={settings.emailSettings.emailTo}
                    onChange={handleEmailChange}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor="enableNotifications" className="mb-1 block">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications when someone submits the
                      contact form.
                    </p>
                  </div>
                  <Switch
                    id="enableNotifications"
                    checked={settings.emailSettings.enableNotifications}
                    onCheckedChange={handleEmailSwitchChange}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button type="button" variant="outline">
                  Test Connection
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
