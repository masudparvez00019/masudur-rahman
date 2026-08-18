import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Serializes MongoDB documents to plain objects for client components
 */
export function serializeData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

  // Format date
export const formatDate = (dateString: string) => {
    if (dateString === "Present") return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

    // Calculate experience duration in readable format
export const calculateDuration = (startDate: string, endDate: string) => {
      const start = new Date(startDate);
      const end = endDate === "Present" ? new Date() : new Date(endDate);
  
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
  
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
  
      let duration = "";
      if (years > 0) {
        duration += `${years} year${years > 1 ? "s" : ""}`;
      }
      if (remainingMonths > 0 || years === 0) {
        if (years > 0) duration += " ";
        duration += `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
      }
  
      return duration;
    };
  

// Helper function to convert MongoDB documents to plain objects
export function serializeDocument(doc: any): any {
  if (!doc) return null

  if (Array.isArray(doc)) {
    return doc.map((item) => serializeDocument(item))
  }

  if (doc && typeof doc === "object" && doc.constructor.name === "model") {
    const plainObject = doc.toObject ? doc.toObject() : { ...doc }
    return serializeDocument(plainObject)
  }

  if (doc && typeof doc === "object") {
    const result: any = {}

    for (const [key, value] of Object.entries(doc)) {
      if (key === "_id" || (typeof value === "object" && value !== null && "toString" in value)) {
        result[key] = value.toString()
      } else if (typeof value === "object" && value !== null) {
        result[key] = serializeDocument(value)
      } else {
        result[key] = value
      }
    }

    return result
  }

  return doc
}