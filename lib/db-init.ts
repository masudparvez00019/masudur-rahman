import { connectToDB } from "./mongodb";

/**
 * Initialize database and preload models
 * Can be used in layout.tsx or other initialization files
 */
export async function initDatabase() {
  try {
    // Connect to database
    await connectToDB();
    console.log("✅ Database connection initialized");
    
    // This will ensure all models are loaded
    await import("@/lib/models");
    console.log("✅ Database models registered");
    
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    return false;
  }
}
