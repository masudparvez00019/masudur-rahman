"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AISettings {
  _id: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  modelName: string;
  personalityTraits: string[];
  knowledgeAreas: string[];
  welcomeMessage: string;
  isEnabled: boolean;
}

export default function AdminAI() {
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newPersonalityTrait, setNewPersonalityTrait] = useState("");
  const [newKnowledgeArea, setNewKnowledgeArea] = useState("");


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/chat/settings");
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching AI settings:", error);
        toast.error("Failed to load AI settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/chat/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("AI settings saved successfully");
    } catch (error) {
      console.error("Error saving AI settings:", error);
      toast.error("Failed to save AI settings");
    } finally {
      setIsSaving(false);
    }
  };

  const addPersonalityTrait = () => {
    if (!newPersonalityTrait.trim() || !settings) return;

    setSettings({
      ...settings,
      personalityTraits: [
        ...settings.personalityTraits,
        newPersonalityTrait.trim(),
      ],
    });
    setNewPersonalityTrait("");
  };

  const removePersonalityTrait = (index: number) => {
    if (!settings) return;

    const newTraits = [...settings.personalityTraits];
    newTraits.splice(index, 1);

    setSettings({
      ...settings,
      personalityTraits: newTraits,
    });
  };

  const addKnowledgeArea = () => {
    if (!newKnowledgeArea.trim() || !settings) return;

    setSettings({
      ...settings,
      knowledgeAreas: [...settings.knowledgeAreas, newKnowledgeArea.trim()],
    });
    setNewKnowledgeArea("");
  };

  const removeKnowledgeArea = (index: number) => {
    if (!settings) return;

    const newAreas = [...settings.knowledgeAreas];
    newAreas.splice(index, 1);

    setSettings({
      ...settings,
      knowledgeAreas: newAreas,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center p-8">
        <p>Failed to load AI settings. Please try again.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Reload
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Chat Settings</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="model">Model Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic settings for your AI chat assistant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ai-enabled">Enable AI Chat</Label>
                    <p className="text-sm text-muted-foreground">
                      Turn the AI chat assistant on or off
                    </p>
                  </div>
                  <Switch
                    id="ai-enabled"
                    checked={settings.isEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, isEnabled: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Textarea
                    id="welcome-message"
                    value={settings.welcomeMessage}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        welcomeMessage: e.target.value,
                      })
                    }
                    placeholder="Enter the welcome message for new chats"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    This message will be shown when a user starts a new chat
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model-name">Model Name</Label>
                  <Input
                    id="model-name"
                    value={settings.modelName}
                    onChange={(e) =>
                      setSettings({ ...settings, modelName: e.target.value })
                    }
                    placeholder="e.g., gemini-1.5-pro"
                  />
                  <p className="text-sm text-muted-foreground">
                    The Gemini AI model to use for chat responses
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personality">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personality Settings</CardTitle>
                <CardDescription>
                  Configure how your AI assistant behaves and responds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    value={settings.systemPrompt}
                    onChange={(e) =>
                      setSettings({ ...settings, systemPrompt: e.target.value })
                    }
                    placeholder="Enter the system prompt for the AI"
                    rows={5}
                  />
                  <p className="text-sm text-muted-foreground">
                    This prompt guides the AI's behavior and personality
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Personality Traits</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {settings.personalityTraits.map((trait, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {trait}
                        <Button
                          onClick={() => removePersonalityTrait(index)}
                          className="text-muted-foreground hover:text-foreground p-1 h-6 w-6"
                          size="icon"
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newPersonalityTrait}
                      onChange={(e) => setNewPersonalityTrait(e.target.value)}
                      placeholder="Add a personality trait"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addPersonalityTrait();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addPersonalityTrait}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Knowledge Areas</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {settings.knowledgeAreas.map((area, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {area}
                        <Button
                          onClick={() => removeKnowledgeArea(index)}
                          className="text-muted-foreground hover:text-foreground p-1 h-6 w-6"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newKnowledgeArea}
                      onChange={(e) => setNewKnowledgeArea(e.target.value)}
                      placeholder="Add a knowledge area"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addKnowledgeArea();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addKnowledgeArea}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="model">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Settings</CardTitle>
                <CardDescription>
                  Configure technical parameters for the AI model
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="temperature">
                        Temperature: {settings.temperature.toFixed(1)}
                      </Label>
                    </div>
                    <Slider
                      id="temperature"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[settings.temperature]}
                      onValueChange={(value) =>
                        setSettings({ ...settings, temperature: value[0] })
                      }
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Lower values make responses more deterministic, higher
                      values make them more creative
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="max-tokens">
                        Max Tokens: {settings.maxTokens}
                      </Label>
                    </div>
                    <Slider
                      id="max-tokens"
                      min={100}
                      max={8192}
                      step={100}
                      value={[settings.maxTokens]}
                      onValueChange={(value) =>
                        setSettings({ ...settings, maxTokens: value[0] })
                      }
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Maximum number of tokens in the AI's response
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
