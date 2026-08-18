import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import ProfileLayout from "./profile-layout";
import ProfileForm from "./components/profile-form";
import ProfileSkeleton from "./components/profile-skeleton";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/actions/user";

export const metadata: Metadata = {
  title: "Profile | Portfolio",
  description: "Manage your profile settings and account information",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/profile");
  }

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileLayout>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Profile</h3>
            <p className="text-sm text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          <ProfileForm user={user} />
        </div>
      </ProfileLayout>
    </Suspense>
  );
}
