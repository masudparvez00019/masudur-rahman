"use client";

import type React from "react";
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
import { PlusCircle, Trash2, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import type { IFooter, IFooterSection, IFooterLink } from "@/lib/models/footer";

export default function AdminFooter() {
  const [loading, setLoading] = useState(false);
  const [footer, setFooter] = useState<Partial<IFooter>>({
    companyName: "",
    companyDescription: "",
    sections: [],
    contactInfo: {
      email: "",
      phone: "",
      address: "",
    },
    copyrightText: "",
    socialLinks: {},
  });

  // New section state
  const [newSection, setNewSection] = useState<Partial<IFooterSection>>({
    title: "",
    links: [],
  });

  // New link state
  const [newLink, setNewLink] = useState<Partial<IFooterLink>>({
    label: "",
    href: "",
    isExternal: false,
  });

  // Current section being edited
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number | null>(
    null
  );

  // New social link state
  const [newSocialKey, setNewSocialKey] = useState("");
  const [newSocialValue, setNewSocialValue] = useState("");

  // Fetch footer data
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch("/api/footer");
        if (response.ok) {
          const data = await response.json();

        //   console.log("Footer fetched:", data); 

          // Ensure socialLinks is an object, not undefined or null
          const socialLinks = data.socialLinks || {};

          setFooter({
            ...data,
            socialLinks:
              Object.keys(socialLinks).length > 0
                ? socialLinks
                : {
                    github: "https://github.com/masudparvez2050",
                    linkedin: "https://www.linkedin.com/in/masudur-rahman-dev",
                    twitter: "https://twitter.com/masudurrahman",
                    website: "https://masudur-rahman.vercel.app/"
                  },
          });
        } else {
          console.error("Failed to fetch footer data");
          // Set default values if fetch fails
          setFooter({
            companyName: "Masudur Rahman",
            companyDescription:
              "Web developer focused on creating beautiful and user-friendly web applications.",
            sections: [],
            contactInfo: {
              email: "contact@masudurrahman.com",
              phone: "+880 1700 000000",
              address: "Dhaka, Bangladesh",
            },
            copyrightText: "© {year} Masudur Rahman. All rights reserved.",
            socialLinks: {
              github: "https://github.com/masudurrahman",
              linkedin: "https://linkedin.com/in/masudurrahman",
              twitter: "https://twitter.com/masudurrahman",
              website: "https://masudurrahman.com",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchFooter();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure socialLinks is not empty
      const dataToSend = { ...footer };
      if (
        !dataToSend.socialLinks ||
        Object.keys(dataToSend.socialLinks).length === 0
      ) {
        dataToSend.socialLinks = {
          github: "https://github.com/masudurrahman",
          linkedin: "https://linkedin.com/in/masudurrahman",
          twitter: "https://twitter.com/masudurrahman",
          website: "https://masudurrahman.com",
        };
      }

      // Log the data being sent
    //   console.log("Sending footer data:", JSON.stringify(dataToSend));

      const response = await fetch("/api/footer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.json();
    //   console.log("API response:", response.status, responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update footer");
      }

      toast.success("Footer updated successfully");
    } catch (error) {
      console.error("Error updating footer:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update footer"
      );
    } finally {
      setLoading(false);
    }
  };

  // Add a new section
  const addSection = () => {
    if (!newSection.title) return;

    setFooter((prev) => {
      const currentSections = prev.sections || [];
      return {
        ...prev,
        sections: [
          ...currentSections,
          { title: newSection.title || "", links: [] } as IFooterSection,
        ],
      };
    });

    setNewSection({ title: "", links: [] });
  };

  // Remove a section
  const removeSection = (index: number) => {
    setFooter((prev) => {
      const currentSections = prev.sections || [];
      return {
        ...prev,
        sections: currentSections.filter((_, i) => i !== index),
      };
    });
  };

  // Add a new link to a section
  const addLink = () => {
    if (currentSectionIndex === null || !newLink.label || !newLink.href) return;

    setFooter((prev) => {
      const updatedSections = [...(prev.sections || [])];
      const section = updatedSections[currentSectionIndex];
      if (section) {
        section.links = [
          ...(section.links || []),
          {
            label: newLink.label || "",
            href: newLink.href || "",
            isExternal: newLink.isExternal || false,
          } as IFooterLink,
        ];
      }
      return { ...prev, sections: updatedSections };
    });

    setNewLink({ label: "", href: "", isExternal: false });
  };

  // Remove a link from a section
  const removeLink = (sectionIndex: number, linkIndex: number) => {
    setFooter((prev) => {
      const updatedSections = [...(prev.sections || [])];
      updatedSections[sectionIndex].links = updatedSections[
        sectionIndex
      ].links.filter((_, i) => i !== linkIndex);
      return { ...prev, sections: updatedSections };
    });
  };

  // Add a new social link
  const addSocialLink = () => {
    if (!newSocialKey || !newSocialValue) return;

    setFooter((prev) => ({
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
    const newSocialLinks = { ...(footer.socialLinks || {}) };
    delete newSocialLinks[key];

    setFooter((prev) => ({
      ...prev,
      socialLinks: newSocialLinks,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general footer settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={footer.companyName || ""}
                  onChange={(e) =>
                    setFooter({ ...footer, companyName: e.target.value })
                  }
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  value={footer.companyDescription || ""}
                  onChange={(e) =>
                    setFooter({ ...footer, companyDescription: e.target.value })
                  }
                  placeholder="Enter company description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="copyrightText">Copyright Text</Label>
                <Input
                  id="copyrightText"
                  value={footer.copyrightText || ""}
                  onChange={(e) =>
                    setFooter({ ...footer, copyrightText: e.target.value })
                  }
                  placeholder="© {year} Company Name. All rights reserved."
                />
                <p className="text-xs text-muted-foreground">
                  Use {"{year}"} to automatically insert the current year.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections */}
        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <CardTitle>Footer Sections</CardTitle>
              <CardDescription>
                Manage footer sections and links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* List of sections */}
              {footer.sections?.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="border rounded-md p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{section.title}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSection(sectionIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Links in this section */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Links</h4>
                    {section.links?.map((link, linkIndex) => (
                      <div
                        key={linkIndex}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm font-medium">Label</p>
                            <p>{link.label}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Link</p>
                            <p>{link.href}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor={`external-${sectionIndex}-${linkIndex}`}
                              className="text-sm"
                            >
                              External
                            </Label>
                            <Switch
                              id={`external-${sectionIndex}-${linkIndex}`}
                              checked={link.isExternal}
                              onCheckedChange={(checked) => {
                                const updatedSections = [
                                  ...(footer.sections || []),
                                ];
                                updatedSections[sectionIndex].links[
                                  linkIndex
                                ].isExternal = checked;
                                setFooter({
                                  ...footer,
                                  sections: updatedSections,
                                });
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLink(sectionIndex, linkIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Add link to this section */}
                    <div className="mt-2 p-2 border rounded-md">
                      <h4 className="text-sm font-medium mb-2">Add New Link</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input
                          placeholder="Label"
                          value={newLink.label}
                          onChange={(e) =>
                            setNewLink({ ...newLink, label: e.target.value })
                          }
                        />
                        <Input
                          placeholder="URL"
                          value={newLink.href}
                          onChange={(e) =>
                            setNewLink({ ...newLink, href: e.target.value })
                          }
                        />
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="newLinkExternal"
                              className="text-sm"
                            >
                              External
                            </Label>
                            <Switch
                              id="newLinkExternal"
                              checked={newLink.isExternal || false}
                              onCheckedChange={(checked) =>
                                setNewLink({ ...newLink, isExternal: checked })
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => {
                              setCurrentSectionIndex(sectionIndex);
                              addLink();
                            }}
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add new section */}
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Add New Section</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Section Title"
                    value={newSection.title}
                    onChange={(e) =>
                      setNewSection({ ...newSection, title: e.target.value })
                    }
                  />
                  <Button type="button" onClick={addSection}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Manage contact details displayed in the footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={footer.contactInfo?.email || ""}
                  onChange={(e) =>
                    setFooter({
                      ...footer,
                      contactInfo: {
                        email: e.target.value,
                        phone: footer.contactInfo?.phone || "",
                        address: footer.contactInfo?.address || "",
                      },
                    })
                  }
                  placeholder="contact@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={footer.contactInfo?.phone || ""}
                  onChange={(e) =>
                    setFooter({
                      ...footer,
                      contactInfo: {
                        email: footer.contactInfo?.email || "",
                        phone: e.target.value,
                        address: footer.contactInfo?.address || "",
                      },
                    })
                  }
                  placeholder="+1 234 567 890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={footer.contactInfo?.address || ""}
                  onChange={(e) =>
                    setFooter({
                      ...footer,
                      contactInfo: {
                        email: footer.contactInfo?.email || "",
                        phone: footer.contactInfo?.phone || "",
                        address: e.target.value,
                      },
                    })
                  }
                  placeholder="123 Street Name, City, Country"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Manage social media links in the footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(footer.socialLinks || {}).map(
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
