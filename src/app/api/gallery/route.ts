import { NextResponse } from "next/server";
import { readPhotos } from "@/lib/gallery-store";

export async function GET() {
  const photos = await readPhotos();
  return NextResponse.json({ photos });
}
