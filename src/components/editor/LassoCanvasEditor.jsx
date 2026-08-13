import React, { useState, useRef, useEffect } from 'react';
import {
  X, Upload, Image as ImageIcon, Trash2, Eye, EyeOff, ArrowUp, ArrowDown,
  RotateCw, ZoomIn, Move, Layers, Check, RefreshCw, FlipHorizontal, Sparkles, AlertCircle
} from 'lucide-react';
import { DECAL_PRESETS } from '../../utils/constants';

export function LassoCanvasEditor({
  isOpen = false,
  selectedPanelNames = [],
  initialLayers = [],
  onSaveLayers,
  onClose
}) {
  const [layers, setLayers] = useState(initialLayers);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);

  // Lasso Tool state: 'idle', 'drawing', 'complete'
  const [lassoMode, setLassoMode] = useState('idle');
  const [lassoPoints, setLassoPoints] = useState([]);

  // Active layer transform state
  const canvasRef = useRef(null);

  useEffect(() => {
    setLayers(initialLayers);
    if (initialLayers.length > 0) {
      setActiveLayerIndex(0);
      if (initialLayers[0]?.lassoPoints) {
        setLassoPoints(initialLayers[0].lassoPoints);
      }
    } else {
      // Create initial layer if none
      const newDefaultLayer = {
        id: `layer_${Date.now()}`,
        name: 'Decal Layer 1',
        imageUrl: DECAL_PRESETS[0].url,
        visible: true,
        opacity: 1.0,
        blendMode: 'source-over',
        lassoPoints: [],
        transform: { posX: 0.5, posY: 0.5, scale: 0.6, rotation: 0, flipH: false, flipV: false }
      };
      setLayers([newDefaultLayer]);
      setActiveLayerIndex(0);
    }
  }, [isOpen, initialLayers]);

  // Redraw 2D Canvas Editor Preview
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background Panel Surface
    ctx.fillStyle = '#161b26';
    ctx.fillRect(0, 0, w, h);

    // Render Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Draw active layers sequentially
    layers.forEach((layer, idx) => {
      if (!layer.visible || !layer.imageUrl) return;

      const img = new Image();
      img.src = layer.imageUrl;
      img.onload = () => {
        ctx.save();

        // Apply Lasso Mask if exists
        const pointsToUse = idx === activeLayerIndex && lassoPoints.length > 2 ? lassoPoints : layer.lassoPoints;
        if (pointsToUse && pointsToUse.length > 2) {
          ctx.beginPath();
          ctx.moveTo(pointsToUse[0].x * w, pointsToUse[0].y * h);
          for (let p = 1; p < pointsToUse.length; p++) {
            ctx.lineTo(pointsToUse[p].x * w, pointsToUse[p].y * h);
          }
          ctx.closePath();
          ctx.clip();
        }

        ctx.globalAlpha = layer.opacity ?? 1.0;
        ctx.globalCompositeOperation = layer.blendMode || 'source-over';

        const t = layer.transform || { posX: 0.5, posY: 0.5, scale: 0.5, rotation: 0, flipH: false, flipV: false };
        const cx = t.posX * w;
        const cy = t.posY * h;
        const aspect = img.width / img.height;
        const baseSize = w * t.scale;
        const drawW = baseSize * (aspect >= 1 ? 1 : aspect);
        const drawH = baseSize * (aspect >= 1 ? (1 / aspect) : 1);

        ctx.translate(cx, cy);
        ctx.rotate((t.rotation * Math.PI) / 180);
        ctx.scale(t.flipH ? -1 : 1, t.flipV ? -1 : 1);

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        // Draw active layer border box if active
        if (idx === activeLayerIndex) {
          ctx.save();
          ctx.strokeStyle = '#00f3ff';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.strokeRect(cx - drawW / 2, cy - drawH / 2, drawW, drawH);
          ctx.restore();
        }
      };
    });

    // Render Lasso Path & Points Overlay
    if (lassoPoints.length > 0) {
      ctx.save();
      ctx.strokeStyle = '#ff007f';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(255, 0, 127, 0.15)';
      ctx.beginPath();
      ctx.moveTo(lassoPoints[0].x * w, lassoPoints[0].y * h);
      for (let i = 1; i < lassoPoints.length; i++) {
        ctx.lineTo(lassoPoints[i].x * w, lassoPoints[i].y * h);
      }
      if (lassoMode === 'complete' || lassoPoints.length > 2) {
        ctx.closePath();
        ctx.fill();
      }
      ctx.stroke();

      // Draw Lasso Vertices
      lassoPoints.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x * w, pt.y * h, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#00f3ff';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      });
      ctx.restore();
    }
  }, [isOpen, layers, activeLayerIndex, lassoPoints, lassoMode]);

  if (!isOpen) return null;

  const currentLayer = layers[activeLayerIndex] || layers[0];

  const handleCanvasClick = (e) => {
    if (lassoMode !== 'drawing') return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const newPoints = [...lassoPoints, { x, y }];
    setLassoPoints(newPoints);

    // Update active layer lasso points
    const updated = [...layers];
    if (updated[activeLayerIndex]) {
      updated[activeLayerIndex].lassoPoints = newPoints;
      setLayers(updated);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      updateCurrentLayer({ imageUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (presetUrl) => {
    updateCurrentLayer({ imageUrl: presetUrl });
  };

  const updateCurrentLayer = (partial) => {
    const updated = [...layers];
    if (updated[activeLayerIndex]) {
      updated[activeLayerIndex] = {
        ...updated[activeLayerIndex],
        ...partial,
        transform: {
          ...updated[activeLayerIndex].transform,
          ...(partial.transform || {})
        }
      };
      setLayers(updated);
    }
  };

  const addLayer = () => {
    const newLayer = {
      id: `layer_${Date.now()}`,
      name: `Decal Layer ${layers.length + 1}`,
      imageUrl: DECAL_PRESETS[0].url,
      visible: true,
      opacity: 1.0,
      blendMode: 'source-over',
      lassoPoints: [],
      transform: { posX: 0.5, posY: 0.5, scale: 0.5, rotation: 0, flipH: false, flipV: false }
    };
    setLayers([...layers, newLayer]);
    setActiveLayerIndex(layers.length);
  };

  const deleteLayer = (idx) => {
    if (layers.length <= 1) return;
    const filtered = layers.filter((_, i) => i !== idx);
    setLayers(filtered);
    setActiveLayerIndex(Math.max(0, idx - 1));
  };

  const moveLayer = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= layers.length) return;
    const copy = [...layers];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setLayers(copy);
    setActiveLayerIndex(targetIdx);
  };

  const handleApplyTo3D = () => {
    onSaveLayers?.(layers);
    onClose?.();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ width: '1100px', maxWidth: '95vw', height: '88vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Modal Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '18px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} /> 2D Lasso & Decal Layer Studio
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Panel Terpilih: <strong style={{ color: '#fff' }}>{selectedPanelNames.join(', ') || 'Semua Panel'}</strong>
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 340px', overflow: 'hidden' }}>

          {/* Left Canvas Preview Area */}
          <div style={{ background: '#0d1017', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

            {/* Lasso Toolbar Bar */}
            <div className="glass-panel-light" style={{ position: 'absolute', top: '20px', display: 'flex', gap: '8px', zIndex: 10, padding: '6px 12px', borderRadius: '30px' }}>
              <button
                className={`btn ${lassoMode === 'drawing' ? 'btn-accent' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setLassoMode(lassoMode === 'drawing' ? 'complete' : 'drawing')}
              >
                ✏️ {lassoMode === 'drawing' ? 'Selesai Draw Lasso' : 'Gambar Lasso Area'}
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => {
                  setLassoPoints([]);
                  setLassoMode('idle');
                  updateCurrentLayer({ lassoPoints: [] });
                }}
              >
                <RefreshCw size={14} /> Reset Lasso
              </button>
            </div>

            {/* Main Interactive 2D Canvas */}
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              onClick={handleCanvasClick}
              style={{
                width: '100%',
                maxHeight: 'calc(88vh - 160px)',
                aspectRatio: '1/1',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                cursor: lassoMode === 'drawing' ? 'crosshair' : 'default',
                boxShadow: 'var(--shadow-lg)'
              }}
            />

            <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
              {lassoMode === 'drawing' ? 'Klik di area canvas untuk menambahkan titik sudut Lasso polygon.' : 'Gambar otomatis ter-mask di dalam batas area Lasso.'}
            </p>
          </div>

          {/* Right Layer & Controls Sidebar */}
          <div style={{ borderLeft: '1px solid var(--border-color)', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* 1. Layers List Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={16} /> Stack Decal Layers ({layers.length})
                </h4>
                <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={addLayer}>
                  + Layer
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                {layers.map((layer, idx) => (
                  <div
                    key={layer.id || idx}
                    onClick={() => {
                      setActiveLayerIndex(idx);
                      setLassoPoints(layer.lassoPoints || []);
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: idx === activeLayerIndex ? 'rgba(0, 243, 255, 0.12)' : 'var(--bg-surface)',
                      border: idx === activeLayerIndex ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={layer.imageUrl} alt="" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'contain', background: '#000' }} />
                      <span style={{ fontSize: '13px', fontWeight: idx === activeLayerIndex ? '600' : '400' }}>{layer.name}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        className="btn-icon"
                        style={{ padding: '4px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveLayer(idx, -1);
                        }}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        className="btn-icon"
                        style={{ padding: '4px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveLayer(idx, 1);
                        }}
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        className="btn-icon"
                        style={{ padding: '4px', color: '#ef4444' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLayer(idx);
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Image Source & Presets */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '13px', marginBottom: '10px' }}>Upload Gambar / Preset Itasha</h4>

              <label className="btn btn-secondary" style={{ width: '100%', marginBottom: '12px', gap: '8px' }}>
                <Upload size={16} /> Pilih File Gambar (PNG/JPG)
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>

              {/* Presets Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {DECAL_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.url)}
                    style={{
                      padding: '6px',
                      background: 'var(--bg-surface)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <img src={preset.url} alt={preset.name} style={{ width: '100%', height: '45px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {preset.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Transform Controls (Pos, Scale, Rotation, Opacity) */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '13px', marginBottom: '10px' }}>Transformasi & Stiling</h4>

              {/* Scale Slider */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  Skala / Ukuran <span>{Math.round((currentLayer?.transform?.scale ?? 0.5) * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.02"
                  value={currentLayer?.transform?.scale ?? 0.5}
                  onChange={(e) => updateCurrentLayer({ transform: { scale: parseFloat(e.target.value) } })}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Rotation Slider */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  Rotasi <span>{Math.round(currentLayer?.transform?.rotation ?? 0)}°</span>
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={currentLayer?.transform?.rotation ?? 0}
                  onChange={(e) => updateCurrentLayer({ transform: { rotation: parseInt(e.target.value) } })}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Opacity Slider */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  Opasitas Layer <span>{Math.round((currentLayer?.opacity ?? 1.0) * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={currentLayer?.opacity ?? 1.0}
                  onChange={(e) => updateCurrentLayer({ opacity: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Posisi X & Y Sliders */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Posisi X</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={currentLayer?.transform?.posX ?? 0.5}
                    onChange={(e) => updateCurrentLayer({ transform: { posX: parseFloat(e.target.value) } })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Posisi Y</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={currentLayer?.transform?.posY ?? 0.5}
                    onChange={(e) => updateCurrentLayer({ transform: { posY: parseFloat(e.target.value) } })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Flip Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '6px', fontSize: '12px' }}
                  onClick={() => updateCurrentLayer({ transform: { flipH: !currentLayer?.transform?.flipH } })}
                >
                  <FlipHorizontal size={14} /> Flip Horisontal
                </button>
              </div>
            </div>

            {/* Apply Button */}
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: 'auto', gap: '8px' }}
              onClick={handleApplyTo3D}
            >
              <Check size={18} /> Terapkan Livery ke Model 3D
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
