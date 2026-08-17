import fs from 'node:fs';

// Dimensions d'un JPEG ou PNG local — évite une dépendance pour le seul
// besoin du gating og:image (build uniquement). Le format est détecté par
// magic bytes, pas par extension : certains .jpg du repo sont des PNG.
export function imageSize(filePath: string): { width: number; height: number } | null {
  let buf: Buffer;
  try {
    buf = fs.readFileSync(filePath);
  } catch {
    return null;
  }
  if (buf.length < 24) return null;

  // PNG : IHDR à offset fixe
  if (buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // JPEG : dimensions dans les marqueurs SOF
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) return null;
    const marker = buf[offset + 1];
    // SOF0–SOF15 sauf DHT (C4), JPG (C8), DAC (CC)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    offset += 2 + buf.readUInt16BE(offset + 2);
  }
  return null;
}
