import * as THREE from 'three';

/**
 * High-performance Canvas & Texture Manager for 3D Itasha Vehicle Wrapping.
 * Handles dynamic per-panel texture generation, lasso polygon clipping,
 * layer compositing, and real-time Three.js CanvasTexture updates.
 */
export class PanelTextureManager {
  constructor(resolution = 1024) {
    this.resolution = resolution;
    this.canvases = new Map(); // panelId -> HTMLCanvasElement
    this.contexts = new Map(); // panelId -> CanvasRenderingContext2D
    this.textures = new Map(); // panelId -> THREE.CanvasTexture
    this.loadedImageCache = new Map(); // url -> HTMLImageElement
  }

  getOrCreateTexture(panelId, baseColor = '#ffffff') {
    if (this.textures.has(panelId)) {
      return this.textures.get(panelId);
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.resolution;
    canvas.height = this.resolution;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Initial base color
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, this.resolution, this.resolution);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.flipY = false; // GLTF standard UV orientation

    this.canvases.set(panelId, canvas);
    this.contexts.set(panelId, ctx);
    this.textures.set(panelId, texture);

    return texture;
  }

  async renderPanelLayers(panelId, baseColor = '#39c5bb', layers = []) {
    const texture = this.getOrCreateTexture(panelId, baseColor);
    const canvas = this.canvases.get(panelId);
    const ctx = this.contexts.get(panelId);
    const res = this.resolution;

    // 1. Clear & Fill Base Paint Coat
    ctx.clearRect(0, 0, res, res);
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, res, res);

    // 2. Render Micro Surface Texture (Subtle Gloss & Grid)
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1.5;
    const step = 64;
    for (let i = 0; i < res; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i, res);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i); ctx.lineTo(res, i);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Render Each Active Decal Layer Sequentially
    for (const layer of layers) {
      if (!layer.visible || !layer.imageUrl) continue;

      try {
        const img = await this.loadImage(layer.imageUrl);
        ctx.save();

        // Apply Lasso Polygon Mask if vertices exist
        if (layer.lassoPoints && layer.lassoPoints.length > 2) {
          ctx.beginPath();
          const first = layer.lassoPoints[0];
          ctx.moveTo(first.x * res, first.y * res);
          for (let p = 1; p < layer.lassoPoints.length; p++) {
            const pt = layer.lassoPoints[p];
            ctx.lineTo(pt.x * res, pt.y * res);
          }
          ctx.closePath();
          ctx.clip(); // Mask layer inside the drawn lasso boundary
        }

        // Apply Layer Blend Mode & Opacity
        ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity ?? 1.0));
        ctx.globalCompositeOperation = layer.blendMode || 'source-over';

        // Apply Layer Transformations (Position, Scale, Rotation, Flip)
        const t = layer.transform || { posX: 0.5, posY: 0.5, scale: 0.7, rotation: 0, flipH: false, flipV: false };
        const cx = (t.posX ?? 0.5) * res;
        const cy = (t.posY ?? 0.5) * res;
        const scaleVal = t.scale ?? 0.6;
        const aspect = (img.width && img.height) ? (img.width / img.height) : 1;
        const baseSize = res * scaleVal;
        const drawW = baseSize * (aspect >= 1 ? 1 : aspect);
        const drawH = baseSize * (aspect >= 1 ? (1 / aspect) : 1);

        ctx.translate(cx, cy);
        ctx.rotate(((t.rotation ?? 0) * Math.PI) / 180);
        ctx.scale(t.flipH ? -1 : 1, t.flipV ? -1 : 1);

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

        ctx.restore();
      } catch (err) {
        console.warn(`[PanelTextureManager] Error rendering layer on panel ${panelId}:`, err);
      }
    }

    texture.needsUpdate = true;
    return texture;
  }

  loadImage(url) {
    if (this.loadedImageCache.has(url)) {
      const cached = this.loadedImageCache.get(url);
      if (cached.complete) return Promise.resolve(cached);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.loadedImageCache.set(url, img);
        resolve(img);
      };
      img.onerror = (err) => {
        console.warn('Failed to load decal image URL:', url, err);
        reject(err);
      };
      img.src = url;
    });
  }

  dispose() {
    this.textures.forEach((texture) => texture.dispose());
    this.canvases.clear();
    this.contexts.clear();
    this.textures.clear();
    this.loadedImageCache.clear();
  }
}

export const textureManager = new PanelTextureManager(1024);
