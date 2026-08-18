import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  total,
  label,
  showPercentage = true,
  size = "md",
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  const heightClass = size === "sm" ? "h-1" : size === "md" ? "h-2" : "h-3";

  return (
    <div className="space-y-1">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-muted-foreground">{percentage}%</span>
          )}
        </div>
      )}
      <Progress value={percentage} className={heightClass} />
    </div>
  );
}
