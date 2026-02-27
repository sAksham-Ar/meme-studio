import type { ImageOverlayItem } from '@stores/ImageOverlay/ImageOverlay.store'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()

    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

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
  targetHeight
}: {
  baseBlob: Blob
  overlayItems: ImageOverlayItem[]
  canvasDisplayWidth: number
  canvasDisplayHeight: number
  targetWidth: number
  targetHeight: number
}): Promise<Blob> {
  if (overlayItems.length === 0) {
    return baseBlob
  }

  const canvas = document.createElement('canvas')

  canvas.width = targetWidth
  canvas.height = targetHeight

  const canvasCtx = canvas.getContext('2d')

  if (!canvasCtx) {
    return baseBlob
  }

  const baseUrl = URL.createObjectURL(baseBlob)
  const baseImg = await loadImage(baseUrl)

  canvasCtx.drawImage(baseImg, 0, 0, targetWidth, targetHeight)
  URL.revokeObjectURL(baseUrl)

  const scaleX = targetWidth / canvasDisplayWidth
  const scaleY = targetHeight / canvasDisplayHeight

  const overlayImages = await Promise.all(
    overlayItems.map((item) => loadImage(item.src))
  )

  overlayImages.forEach((img, index) => {
    const item = overlayItems[index]

    if (!item) {
      return
    }

    const scaledW = item.width * scaleX
    const scaledH = item.height * scaleY
    const scaledCx = item.centerX * scaleX
    const scaledCy = item.centerY * scaleY

    canvasCtx.save()
    canvasCtx.globalAlpha = item.opacity
    canvasCtx.translate(scaledCx, scaledCy)
    canvasCtx.rotate((item.rotate * Math.PI) / 180)
    canvasCtx.drawImage(img, -scaledW / 2, -scaledH / 2, scaledW, scaledH)
    canvasCtx.restore()
  })

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Failed to generate canvas blob'))
      }
    }, 'image/png')
  })
}
