import { promises as fs } from "fs";
import path from "path";

export type GuestPhoto = {
  url: string;
  uploadedAt: string;
};

// Docker'da bu klasör docker-compose.yml içinde bir volume ile Pi'nin
// diskine bağlanır, container yeniden oluşturulsa bile veriler kaybolmaz.
const DATA_DIR = process.env.GALLERY_DATA_DIR || path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "photos.json");

let writeQueue: Promise<unknown> = Promise.resolve();

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ photos: [] }, null, 2));
  }
}

export async function readPhotos(): Promise<GuestPhoto[]> {
  await ensureFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data?.photos) ? data.photos : [];
  } catch (err) {
    console.error("Galeri dosyası okunamadı:", err);
    return [];
  }
}

export async function addPhoto(photo: GuestPhoto): Promise<GuestPhoto[]> {
  // Aynı anda gelen yükleme isteklerinin birbirinin üzerine yazmaması için
  // yazma işlemlerini sıraya alıyoruz.
  const task = writeQueue.then(async () => {
    await ensureFile();
    const photos = await readPhotos();
    const updated = [...photos, photo];
    await fs.writeFile(DATA_FILE, JSON.stringify({ photos: updated }, null, 2));
    return updated;
  });
  writeQueue = task.catch(() => {});
  return task;
}
