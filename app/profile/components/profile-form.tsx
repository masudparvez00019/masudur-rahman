"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { updateUserProfile, uploadProfileImage } from "@/lib/actions/user"
import { Loader2, Camera } from "lucide-react"
import type { IUser } from "@/lib/models/user"
import { toast } from "sonner"

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().optional(),
  location: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  user: Partial<IUser>
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
      location: user.location || "",
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("bio", data.bio || "")
      formData.append("location", data.location || "")

      await updateUserProfile(formData)
      toast.success("Your profile has been updated successfully." )
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const result = await uploadProfileImage(formData)

      if (result.success) {
        toast.success("Your profile image has been updated successfully.")

        // Force a refresh to show the new image
        window.location.reload()
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          </Button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.isAdmin && (
            <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
              Administrator
            </span>
          )}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} placeholder="Your name" />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email || ""} disabled className="bg-muted/50" />
            <p className="text-xs text-muted-foreground">
              Your email address cannot be changed. Contact support if you need to update it.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" {...form.register("bio")} placeholder="Tell us about yourself" rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...form.register("location")} placeholder="City, Country" />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  )
}
