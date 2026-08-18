import { connectToDB } from "@/lib/mongodb";
import { Settings } from "@/lib/models/settings";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// GET settings
export async function GET(req: Request) {
  try {
    await connectToDB();

    // Get the first settings document or create a default one if none exists
    let settings = await Settings.findOne().lean(); // Use .lean() to get a plain object

    if (!settings) {
      settings = await Settings.create({});
      settings = settings.toObject(); // Convert to plain object
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ message: "Error fetching settings" }, { status: 500 });
  }
}

// POST update settings (admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const settingsData = await req.json();
    console.log("Received settings data:", settingsData);

    // Get the first settings document or create a default one if none exists
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(settingsData);
    } else {
      // Update existing settings
      settings = await Settings.findOneAndUpdate({}, settingsData, {
        new: true,
        runValidators: true,
      });
    }

    return NextResponse.json(settings.toObject(), { status: 200 }); // Convert to plain object
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ message: "Error updating settings" }, { status: 500 });
  }
}

// PUT update settings (admin only) - Optional, can be removed if not needed
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const settingsData = await req.json();
    console.log("Received settings data (PUT):", settingsData);

    // Get the first settings document or create a default one if none exists
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(settingsData);
    } else {
      // Update existing settings
      settings = await Settings.findOneAndUpdate({}, settingsData, {
        new: true,
        runValidators: true,
      });
    }

    return NextResponse.json(settings.toObject(), { status: 200 }); // Convert to plain object
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ message: "Error updating settings" }, { status: 500 });
  }
}