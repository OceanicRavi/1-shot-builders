import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { action, userId, targetType, targetId, meta } = await request.json();

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin().from("audit_logs").insert({
      user_id: userId,
      action,
      target_type: targetType,
      target_id: targetId,
      meta,
    }).select();

    if (error) {
      console.error("Error creating audit log:", error);
      return NextResponse.json(
        { error: "Failed to create audit log" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in audit log API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}