import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex flex-col items-center space-y-4 p-8 rounded-lg shadow-xl bg-card">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-semibold text-card-foreground">Loading...</p>
        <p className="text-sm text-muted-foreground">
          Please wait while we prepare the content.
        </p>
      </div>
    </div>
  );
}
