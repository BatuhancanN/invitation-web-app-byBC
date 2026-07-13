import { NextResponse } from "next/server";
import { addPhoto } from "@/lib/gallery-store";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const imgbbKey = process.env.IMGBB_API_KEY;
  const uploadPin = process.env.GUEST_UPLOAD_PIN;

  if (!imgbbKey || !uploadPin) {
    return NextResponse.json(
      { error: "Fotoğraf yükleme sistemi henüz yapılandırılmadı." },
      { status: 503 }
    );
  }

  const formData = await req.formData();
  const pin = formData.get("pin");
  const file = formData.get("file");

  if (typeof pin !== "string" || pin !== uploadPin) {
    return NextResponse.json({ error: "Girdiğiniz kod hatalı." }, { status: 401 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Bir fotoğraf seçmelisiniz." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Sadece fotoğraf dosyaları yükleyebilirsiniz." }, { status: 400 });
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "Fotoğraf en fazla 10 MB olabilir." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");

  const imgbbForm = new URLSearchParams();
  imgbbForm.set("image", base64);

  const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
    method: "POST",
    body: imgbbForm,
  });

  if (!imgbbRes.ok) {
    return NextResponse.json({ error: "Fotoğraf yüklenirken bir sorun oluştu." }, { status: 502 });
  }

  const imgbbData = await imgbbRes.json();
  const url: string | undefined = imgbbData?.data?.display_url ?? imgbbData?.data?.url;

  if (!url) {
    return NextResponse.json({ error: "Fotoğraf yüklenirken bir sorun oluştu." }, { status: 502 });
  }

  await addPhoto({ url, uploadedAt: new Date().toISOString() });

  return NextResponse.json({ url });
}
