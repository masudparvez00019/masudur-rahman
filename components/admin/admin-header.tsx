"use client";

import type React from "react";
import Image from "next/image"; // Add this import
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Trash2, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import type { IHeader, INavItem } from "@/lib/models/header";

export default function AdminHeader() {
  const [loading, setLoading] = useState(false);
  const [header, setHeader] = useState<Partial<IHeader>>({
    navItems: [],
    hero: {
      title: "",
      subtitle: "",
      description: "",
      typingTexts: [],
      tags: [],
      ctaText: "",
      ctaLink: "",
      showProfileImage: true,
      profileImageUrl: "",
    },
    socialLinks: {},
    logoText: "",
  });
  const [newNavItem, setNewNavItem] = useState<INavItem>({
    label: "",
    href: "",
    isExternal: false,
  });
  const [newTypingText, setNewTypingText] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newSocialKey, setNewSocialKey] = useState("");
  const [newSocialValue, setNewSocialValue] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch header data
  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const response = await fetch("/api/header");
        if (response.ok) {
          const data = await response.json();
          setHeader(
            data || {
              navItems: [],
              hero: {
                title: "",
                subtitle: "",
                description: "",
                typingTexts: [],
                tags: [],
                ctaText: "",
                ctaLink: "",
                showProfileImage: true,
                profileImageUrl: "",
              },
              socialLinks: {},
              logoText: "",
            }
          );
        } else {
          console.error("Failed to fetch header data");
        }
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    };

    fetchHeader();
  }, []);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Cloudinary
  const handleImageUpload = async () => {
    if (!imageFile) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setHeader((prev) => ({
        ...prev,
        hero: {
          ...prev.hero!,
          profileImageUrl: data.url,
        },
      }));

      toast.success("Profile image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Add a new navigation item
  const addNavItem = () => {
    if (!newNavItem.label || !newNavItem.href) return;

    setHeader((prev) => ({
      ...prev,
      navItems: [...(prev.navItems || []), { ...newNavItem }],
    }));

    setNewNavItem({ label: "", href: "", isExternal: false });
  };

  // Remove a navigation item
  const removeNavItem = (index: number) => {
    setHeader((prev) => ({
      ...prev,
      navItems: (prev.navItems || []).filter((_, i) => i !== index),
    }));
  };

  // Add a new typing text
  const addTypingText = () => {
    if (!newTypingText) return;

    setHeader((prev) => ({
      ...prev,
      hero: {
        ...prev.hero!,
        typingTexts: [...(prev.hero?.typingTexts || []), newTypingText],
      },
    }));

    setNewTypingText("");
  };

  // Remove a typing text
  const removeTypingText = (index: number) => {
    setHeader((prev) => ({
      ...prev,
      hero: {
        ...prev.hero!,
        typingTexts: (prev.hero?.typingTexts || []).filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  // Add a new tag
  const addTag = () => {
    if (!newTag) return;

    setHeader((prev) => ({
      ...prev,
      hero: {
        ...prev.hero!,
        tags: [...(prev.hero?.tags || []), newTag],
      },
    }));

    setNewTag("");
  };

  // Remove a tag
  const removeTag = (index: number) => {
    setHeader((prev) => ({
      ...prev,
      hero: {
        ...prev.hero!,
        tags: (prev.hero?.tags || []).filter((_, i) => i !== index),
      },
    }));
  };

  // Add a new social link
  const addSocialLink = () => {
    if (!newSocialKey || !newSocialValue) return;

    setHeader((prev) => ({
      ...prev,
      socialLinks: {
        ...(prev.socialLinks || {}),
        [newSocialKey]: newSocialValue,
      },
    }));

    setNewSocialKey("");
    setNewSocialValue("");
  };

  // Remove a social link
  const removeSocialLink = (key: string) => {
    const newSocialLinks = { ...(header.socialLinks || {}) };
    delete newSocialLinks[key];

    setHeader((prev) => ({
      ...prev,
      socialLinks: newSocialLinks,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Log the data being sent
      // console.log("Sending header data:", JSON.stringify(header));

      const response = await fetch("/api/header", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(header),
      });

      const responseData = await response.json();
      // console.log("API response:", response.status, responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update header");
      }

      toast.success("Header updated successfully");
    } catch (error) {
      console.error("Error updating header:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update header");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general header settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoText">Logo Text</Label>
                <Input
                  id="logoText"
                  value={header.logoText || ""}
                  onChange={(e) =>
                    setHeader({ ...header, logoText: e.target.value })
                  }
                  placeholder="Enter logo text"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation */}
        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Items</CardTitle>
              <CardDescription>Manage navigation menu items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {header.navItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 border rounded-md"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium">Label</p>
                        <p>{item.label}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Link</p>
                        <p>{item.href}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`external-${index}`}
                          className="text-sm"
                        >
                          External
                        </Label>
                        <Switch
                          id={`external-${index}`}
                          checked={item.isExternal}
                          onCheckedChange={(checked) => {
                            const newNavItems = [...(header.navItems || [])];
                            newNavItems[index].isExternal = checked;
                            setHeader({ ...header, navItems: newNavItems });
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeNavItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <Label htmlFor="navLabel">Label</Label>
                  <Input
                    id="navLabel"
                    value={newNavItem.label}
                    onChange={(e) =>
                      setNewNavItem({ ...newNavItem, label: e.target.value })
                    }
                    placeholder="About"
                  />
                </div>
                <div>
                  <Label htmlFor="navHref">Link</Label>
                  <Input
                    id="navHref"
                    value={newNavItem.href}
                    onChange={(e) =>
                      setNewNavItem({ ...newNavItem, href: e.target.value })
                    }
                    placeholder="/#about"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="navExternal">External</Label>
                    <Switch
                      id="navExternal"
                      checked={newNavItem.isExternal}
                      onCheckedChange={(checked) =>
                        setNewNavItem({ ...newNavItem, isExternal: checked })
                      }
                    />
                  </div>
                  <Button type="button" onClick={addNavItem} className="flex-1">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Configure hero section content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Title</Label>
                  <Input
                    id="heroTitle"
                    value={header.hero?.title || ""}
                    onChange={(e) =>
                      setHeader({
                        ...header,
                        hero: { ...header.hero!, title: e.target.value },
                      })
                    }
                    placeholder="Turning ideas into impactful code."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    value={header.hero?.subtitle || ""}
                    onChange={(e) =>
                      setHeader({
                        ...header,
                        hero: { ...header.hero!, subtitle: e.target.value },
                      })
                    }
                    placeholder="Hey, I'm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroDescription">Description</Label>
                <Textarea
                  id="heroDescription"
                  value={header.hero?.description || ""}
                  onChange={(e) =>
                    setHeader({
                      ...header,
                      hero: { ...header.hero!, description: e.target.value },
                    })
                  }
                  placeholder="Building Seamless Solutions, One Line at a Time."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heroCTAText">CTA Text</Label>
                  <Input
                    id="heroCTAText"
                    value={header.hero?.ctaText || ""}
                    onChange={(e) =>
                      setHeader({
                        ...header,
                        hero: { ...header.hero!, ctaText: e.target.value },
                      })
                    }
                    placeholder="Hire Me"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroCTALink">CTA Link</Label>
                  <Input
                    id="heroCTALink"
                    value={header.hero?.ctaLink || ""}
                    onChange={(e) =>
                      setHeader({
                        ...header,
                        hero: { ...header.hero!, ctaLink: e.target.value },
                      })
                    }
                    placeholder="/#contact"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Typing Texts</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newTypingText}
                      onChange={(e) => setNewTypingText(e.target.value)}
                      placeholder="Add typing text"
                      className="w-64"
                    />
                    <Button type="button" onClick={addTypingText} size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {header.hero?.typingTexts?.map((text, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <span>{text}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTypingText(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Tags</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      className="w-64"
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {header.hero?.tags?.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <span>{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTag(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="showProfileImage"
                    checked={header.hero?.showProfileImage}
                    onCheckedChange={(checked) =>
                      setHeader({
                        ...header,
                        hero: { ...header.hero!, showProfileImage: checked },
                      })
                    }
                  />
                  <Label htmlFor="showProfileImage">Show Profile Image</Label>
                </div>

                {header.hero?.showProfileImage && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 border rounded-full overflow-hidden">
                        <Image
                          src={
                            imagePreview ||
                            header.hero?.profileImageUrl ||
                            "/placeholder.svg?height=96&width=96"
                          }
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="mb-2"
                        />
                        <Button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={!imageFile || uploadingImage}
                          className="w-full"
                        >
                          {uploadingImage ? (
                            "Uploading..."
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Image
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <Input
                      value={header.hero?.profileImageUrl || ""}
                      onChange={(e) =>
                        setHeader({
                          ...header,
                          hero: {
                            ...header.hero!,
                            profileImageUrl: e.target.value,
                          },
                        })
                      }
                      placeholder="Profile image URL"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Manage social media links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(header.socialLinks || {}).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 p-2 border rounded-md"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium">Platform</p>
                          <p>{key}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">URL</p>
                          <p className="truncate">{value}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSocialLink(key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <Label htmlFor="socialKey">Platform</Label>
                  <Input
                    id="socialKey"
                    value={newSocialKey}
                    onChange={(e) => setNewSocialKey(e.target.value)}
                    placeholder="github"
                  />
                </div>
                <div>
                  <Label htmlFor="socialValue">URL</Label>
                  <Input
                    id="socialValue"
                    value={newSocialValue}
                    onChange={(e) => setNewSocialValue(e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={addSocialLink}
                    className="w-full"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
