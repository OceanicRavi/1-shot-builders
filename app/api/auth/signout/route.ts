import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  const cookieStore = cookies();
  const supabaseToken = cookieStore.get("sb-access-token")?.value;
  
  if (supabaseToken) {
    await supabase.auth.signOut();
    
    // Clear cookies
    cookies().set("sb-access-token", "", { maxAge: 0 });
    cookies().set("sb-refresh-token", "", { maxAge: 0 });
  }
  
  return NextResponse.json({ success: true });
}