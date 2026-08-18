"use client";

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
import { Loader2, Plus, X, Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {toast} from "sonner";

interface Education {
  degree: string;
  institution: string;
  year: string;
  description: string;
}

interface Language {
  name: string;
  proficiency: string;
}

interface AboutData {
  fullName: string;
  email: string;
  bio: string;
  bioExtended: string;
  bioConclusion: string;
  location: string;
  availability: string;
  resumeUrl: string;
  skills: string[];
  education: Education[];
  interests: string[];
  languages: Language[];
}

export default function AdminAbout() {
  const [about, setAbout] = useState<AboutData>({
    fullName: "",
    email: "",
    bio: "",
    bioExtended: "",
    bioConclusion: "",
    location: "",
    availability: "Full-time",
    resumeUrl: "/resume.pdf",
    skills: [],
    education: [],
    interests: [],
    languages: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState({
    name: "",
    proficiency: "Beginner",
  });


  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/about");

      if (!response.ok) {
        throw new Error(`Error fetching about data: ${response.status}`);
      }

      const data = await response.json();

      if (data) {
        setAbout({
          fullName: data.fullName || "",
          email: data.email || "",
          bio: data.bio || "",
          bioExtended: data.bioExtended || "",
          bioConclusion: data.bioConclusion || "",
          location: data.location || "",
          availability: data.availability || "Full-time",
          resumeUrl: data.resumeUrl || "/resume.pdf",
          skills: data.skills || [],
          education: data.education || [],
          interests: data.interests || [],
          languages: data.languages || [],
        });
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
      toast.error("Failed to load about data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setAbout({ ...about, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });

      if (!response.ok) {
        throw new Error(`Failed to save about data: ${response.status}`);
      }

      toast.success("About data saved", {
        description: "Your about section has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving about data:", error);
      toast.error("Error", {
        description: "Failed to save about data. Please try again."
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle education
  const addEducation = () => {
    setAbout({
      ...about,
      education: [
        ...about.education,
        { degree: "", institution: "", year: "", description: "" },
      ],
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...about.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setAbout({ ...about, education: updatedEducation });
  };

  const removeEducation = (index: number) => {
    const updatedEducation = [...about.education];
    updatedEducation.splice(index, 1);
    setAbout({ ...about, education: updatedEducation });
  };

  // Handle interests
  const addInterest = () => {
    if (newInterest.trim() && !about.interests.includes(newInterest.trim())) {
      setAbout({
        ...about,
        interests: [...about.interests, newInterest.trim()],
      });
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setAbout({
      ...about,
      interests: about.interests.filter((i) => i !== interest),
    });
  };

  // Handle skills
  const addSkill = () => {
    if (newSkill.trim() && !about.skills.includes(newSkill.trim())) {
      setAbout({
        ...about,
        skills: [...about.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setAbout({
      ...about,
      skills: about.skills.filter((s) => s !== skill),
    });
  };

  // Handle languages
  const addLanguage = () => {
    if (newLanguage.name.trim()) {
      setAbout({
        ...about,
        languages: [...about.languages, { ...newLanguage }],
      });
      setNewLanguage({ name: "", proficiency: "Beginner" });
    }
  };

  const removeLanguage = (index: number) => {
    const updatedLanguages = [...about.languages];
    updatedLanguages.splice(index, 1);
    setAbout({ ...about, languages: updatedLanguages });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Section</CardTitle>
        <CardDescription>
          Manage your about section information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills & Interests</TabsTrigger>
              <TabsTrigger value="languages">Languages</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={about.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={about.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    className="min-h-[80px]"
                    value={about.bio}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio Extended</Label>
                  <Textarea
                    id="bioExtended"
                    className="min-h-[100px]"
                    value={about.bioExtended}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio Conclusion</Label>
                  <Textarea
                    id="bioConclusion"
                    className="min-h-[100px]"
                    value={about.bioConclusion}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={about.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <select
                    id="availability"
                    className="w-full p-2 rounded-md border border-input"
                    value={about.availability}
                    onChange={handleChange}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resumeUrl">Resume URL</Label>
                  <Input
                    id="resumeUrl"
                    value={about.resumeUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              {about.education.map((edu, index) => (
                <div key={index} className="p-4 border rounded-md relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeEducation(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input
                        id={`degree-${index}`}
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(index, "degree", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`institution-${index}`}>
                        Institution
                      </Label>
                      <Input
                        id={`institution-${index}`}
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(index, "institution", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`year-${index}`}>Year</Label>
                      <Input
                        id={`year-${index}`}
                        value={edu.year}
                        onChange={(e) =>
                          updateEducation(index, "year", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`description-${index}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`description-${index}`}
                        value={edu.description}
                        onChange={(e) =>
                          updateEducation(index, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addEducation}>
                <Plus className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="space-y-4">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {about.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-muted px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1"
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                  />
                  <Button type="button" onClick={addSkill}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {about.interests.map((interest, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-muted px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1"
                        onClick={() => removeInterest(interest)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addInterest())
                    }
                  />
                  <Button type="button" onClick={addInterest}>
                    Add
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="languages" className="space-y-4">
              <div className="space-y-4">
                <Label>Languages</Label>
                <div className="space-y-2">
                  {about.languages.map((lang, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-md"
                    >
                      <div>
                        <span className="font-medium">{lang.name}</span>
                        <span className="ml-2 text-muted-foreground">
                          ({lang.proficiency})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLanguage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Input
                      placeholder="Language name"
                      value={newLanguage.name}
                      onChange={(e) =>
                        setNewLanguage({ ...newLanguage, name: e.target.value })
                      }
                    />
                  </div>
                  <select
                    className="p-2 rounded-md border border-input"
                    value={newLanguage.proficiency}
                    onChange={(e) =>
                      setNewLanguage({
                        ...newLanguage,
                        proficiency: e.target.value,
                      })
                    }
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                  </select>
                </div>
                <Button type="button" onClick={addLanguage}>
                  Add Language
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
