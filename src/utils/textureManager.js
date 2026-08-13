import * as THREE from 'three';

/**
 * Manages 2D HTML Canvases and dynamic Three.js CanvasTextures for 3D body panels.
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
    const ctx = canvas.getContext('2d');

    // Fill initial base color
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, this.resolution, this.resolution);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.flipY = false; // Match UV orientation

    this.canvases.set(panelId, canvas);
    this.contexts.set(panelId, ctx);
    this.textures.set(panelId, texture);

    return texture;
  }

  async renderPanelLayers(panelId, baseColor, layers = []) {
    const texture = this.getOrCreateTexture(panelId, baseColor);
    const canvas = this.canvases.get(panelId);
    const ctx = this.contexts.get(panelId);
    const res = this.resolution;

    // Reset canvas
    ctx.clearRect(0, 0, res, res);
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, res, res);

    // Draw grid guide line pattern subtly on panel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 2;
    for (let i = 0; i < res; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, res);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(res, i);
      ctx.stroke();
    }

    // Render each active decal layer sequentially
    for (const layer of layers) {
      if (!layer.visible || !layer.imageUrl) continue;

      try {
        const img = await this.loadImage(layer.imageUrl);
        ctx.save();

        // Apply Lasso Mask if polygon points exist
        if (layer.lassoPoints && layer.lassoPoints.length > 2) {
          ctx.beginPath();
          const first = layer.lassoPoints[0];
          ctx.moveTo(first.x * res, first.y * res);
          for (let p = 1; p < layer.lassoPoints.length; p++) {
            const pt = layer.lassoPoints[p];
            ctx.lineTo(pt.x * res, pt.y * res);
          }
          ctx.closePath();
          ctx.clip(); // Mask content inside lasso shape!
        }

        // Layer Blend Mode & Opacity
        ctx.globalAlpha = layer.opacity ?? 1.0;
        ctx.globalCompositeOperation = layer.blendMode || 'source-over';

        // Transformations (Position, Scale, Rotation, Flip)
        const t = layer.transform || { posX: 0.5, posY: 0.5, scale: 0.6, rotation: 0, flipH: false, flipV: false };
        const centerX = t.posX * res;
        const centerY = t.posY * res;
        const aspect = img.width / img.height;
        const baseSize = res * (t.scale ?? 0.5);
        const drawW = baseSize * (aspect >= 1 ? 1 : aspect);
        const drawH = baseSize * (aspect >= 1 ? (1 / aspect) : 1);

        ctx.translate(centerX, centerY);
        ctx.rotate((t.rotation * Math.PI) / 180);
        ctx.scale(t.flipH ? -1 : 1, t.flipV ? -1 : 1);

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

        ctx.restore();
      } catch (err) {
        console.warn(`Failed to render decal layer on panel ${panelId}:`, err);
      }
    }

    texture.needsUpdate = true;
    return texture;
  }

  loadImage(url) {
    if (this.loadedImageCache.has(url)) {
      return Promise.resolve(this.loadedImageCache.get(url));
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.loadedImageCache.set(url, img);
        resolve(img);
      };
      img.onerror = (e) => reject(e);
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
