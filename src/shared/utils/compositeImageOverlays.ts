import type { ImageOverlayItem } from "@stores/ImageOverlay/ImageOverlay.store";

/**
 * Draws image overlays onto an existing canvas Blob.
 * The overlayItems positions/sizes are in display-space (canvasDisplayWidth x canvasDisplayHeight).
 * They must be scaled up to original meme dimensions (targetWidth x targetHeight).
 */
export async function compositeImageOverlays({
  baseBlob,
  overlayItems,
  canvasDisplayWidth,
  canvasDisplayHeight,
  targetWidth,
  targetHeight,
}: {
  baseBlob: Blob;
  overlayItems: ImageOverlayItem[];
  canvasDisplayWidth: number;
  canvasDisplayHeight: number;
  targetWidth: number;
  targetHeight: number;
}): Promise<Blob> {
  if (overlayItems.length === 0) {
    return baseBlob;
  }

  // Create an offscreen canvas at full resolution
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return baseBlob;
  }

  // Draw the base meme (already has text baked in)
  const baseUrl = URL.createObjectURL(baseBlob);
  const baseImg = await loadImage(baseUrl);

  ctx.drawImage(baseImg, 0, 0, targetWidth, targetHeight);
  URL.revokeObjectURL(baseUrl);

  // Scale factor from display to original
  const scaleX = targetWidth / canvasDisplayWidth;
  const scaleY = targetHeight / canvasDisplayHeight;

  // Draw each image overlay
  for (const item of overlayItems) {
    const img = await loadImage(item.src);

    const scaledW = item.width * scaleX;
    const scaledH = item.height * scaleY;
    const scaledCx = item.centerX * scaleX;
    const scaledCy = item.centerY * scaleY;

    ctx.save();
    ctx.globalAlpha = item.opacity;
    ctx.translate(scaledCx, scaledCy);
    ctx.rotate((item.rotate * Math.PI) / 180);
    ctx.drawImage(img, -scaledW / 2, -scaledH / 2, scaledW, scaledH);
    ctx.restore();
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to generate canvas blob"));
      }
    }, "image/png");
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
