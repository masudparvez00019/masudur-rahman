import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProfileNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Profile Not Found</h2>
      <p className="text-muted-foreground text-center mb-8">
        The profile you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
