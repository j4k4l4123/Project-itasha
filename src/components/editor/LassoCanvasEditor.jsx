import React, { useState, useRef, useEffect } from 'react';
import {
  X, Upload, Image as ImageIcon, Trash2, Eye, EyeOff, ArrowUp, ArrowDown,
  RotateCw, ZoomIn, Move, Layers, Check, RefreshCw, FlipHorizontal, FlipVertical,
  Sparkles, AlertCircle, Search, Sliders
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
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Lasso Tool state: 'idle', 'drawing', 'complete'
  const [lassoMode, setLassoMode] = useState('idle');
  const [lassoPoints, setLassoPoints] = useState([]);

  const canvasRef = useRef(null);

  useEffect(() => {
    setLayers(initialLayers);
    if (initialLayers.length > 0) {
      setActiveLayerIndex(0);
      if (initialLayers[0]?.lassoPoints) {
        setLassoPoints(initialLayers[0].lassoPoints);
      }
    } else {
      // Default initial layer with Racing Miku
      const newDefaultLayer = {
        id: `layer_${Date.now()}`,
        name: 'Racing Miku Decal',
        imageUrl: DECAL_PRESETS[0].url,
        visible: true,
        opacity: 1.0,
        blendMode: 'source-over',
        lassoPoints: [],
        transform: { posX: 0.5, posY: 0.5, scale: 0.7, rotation: 0, flipH: false, flipV: false }
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

    // Background Surface
    ctx.fillStyle = '#0f141d';
    ctx.fillRect(0, 0, w, h);

    // Render Precision Grid Pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Center Guides
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

    // Draw layers sequentially
    layers.forEach((layer, idx) => {
      if (!layer.visible || !layer.imageUrl) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = layer.imageUrl;

      const renderLayer = () => {
        ctx.save();

        // Apply Lasso Polygon Mask
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

        ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity ?? 1.0));
        ctx.globalCompositeOperation = layer.blendMode || 'source-over';

        const t = layer.transform || { posX: 0.5, posY: 0.5, scale: 0.7, rotation: 0, flipH: false, flipV: false };
        const cx = (t.posX ?? 0.5) * w;
        const cy = (t.posY ?? 0.5) * h;
        const scaleVal = t.scale ?? 0.6;
        const aspect = (img.width && img.height) ? (img.width / img.height) : 1;
        const baseSize = w * scaleVal;
        const drawW = baseSize * (aspect >= 1 ? 1 : aspect);
        const drawH = baseSize * (aspect >= 1 ? (1 / aspect) : 1);

        ctx.translate(cx, cy);
        ctx.rotate(((t.rotation ?? 0) * Math.PI) / 180);
        ctx.scale(t.flipH ? -1 : 1, t.flipV ? -1 : 1);

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        // Draw active bounding border
        if (idx === activeLayerIndex) {
          ctx.save();
          ctx.strokeStyle = '#00f3ff';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.strokeRect(cx - drawW / 2, cy - drawH / 2, drawW, drawH);
          ctx.restore();
        }
      };

      if (img.complete) {
        renderLayer();
      } else {
        img.onload = renderLayer;
      }
    });

    // Render Lasso Path Overlay
    if (lassoPoints.length > 0) {
      ctx.save();
      ctx.strokeStyle = '#ff007f';
      ctx.lineWidth = 2.5;
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

      // Draw vertices
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
      updateCurrentLayer({ imageUrl: dataUrl, name: file.name.replace(/\.[^/.]+$/, '') });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset) => {
    updateCurrentLayer({ imageUrl: preset.url, name: preset.name });
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
      transform: { posX: 0.5, posY: 0.5, scale: 0.6, rotation: 0, flipH: false, flipV: false }
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

  const categories = ['All', 'Anime Character', 'Typography', 'Sponsors & Badges', 'Graphic Livery'];
  const filteredPresets = categoryFilter === 'All'
    ? DECAL_PRESETS
    : DECAL_PRESETS.filter((p) => p.category === categoryFilter);

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ width: '1180px', maxWidth: '96vw', height: '90vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Modal Header */}
        <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '18px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Sparkles size={20} /> Studio Desain Decal & Lasso Itasha
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Target Panel: <strong style={{ color: '#fff' }}>{selectedPanelNames.join(', ') || 'Semua Panel'}</strong>
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', overflow: 'hidden' }}>

          {/* Left Canvas Studio */}
          <div style={{ background: '#090d15', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

            {/* Lasso Toolbar */}
            <div className="glass-panel-light" style={{ position: 'absolute', top: '16px', display: 'flex', gap: '8px', zIndex: 10, padding: '6px 14px', borderRadius: '30px' }}>
              <button
                className={`btn ${lassoMode === 'drawing' ? 'btn-accent' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setLassoMode(lassoMode === 'drawing' ? 'complete' : 'drawing')}
              >
                ✏️ {lassoMode === 'drawing' ? 'Selesai Buat Lasso' : 'Tarik Area Lasso'}
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
                <RefreshCw size={14} /> Reset Mask
              </button>
            </div>

            {/* 2D Interactive Canvas */}
            <canvas
              ref={canvasRef}
              width={650}
              height={650}
              onClick={handleCanvasClick}
              style={{
                width: '100%',
                maxHeight: 'calc(90vh - 150px)',
                aspectRatio: '1/1',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                cursor: lassoMode === 'drawing' ? 'crosshair' : 'default',
                boxShadow: 'var(--shadow-lg)'
              }}
            />

            <p style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
              {lassoMode === 'drawing'
                ? 'Klik pada canvas untuk membuat polygon clipping mask.'
                : 'Decal otomatis terproyeksikan ke model 3D saat diterapkan.'}
            </p>
          </div>

          {/* Right Controls Sidebar */}
          <div style={{ borderLeft: '1px solid var(--border-color)', padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* 1. Layers Stack */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                  <Layers size={15} /> Layer Decal ({layers.length})
                </h4>
                <button className="btn btn-primary" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={addLayer}>
                  + Tambah Layer
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                {layers.map((layer, idx) => (
                  <div
                    key={layer.id || idx}
                    onClick={() => {
                      setActiveLayerIndex(idx);
                      setLassoPoints(layer.lassoPoints || []);
                    }}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: idx === activeLayerIndex ? 'rgba(0, 243, 255, 0.12)' : 'var(--bg-surface)',
                      border: idx === activeLayerIndex ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <img src={layer.imageUrl} alt="" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'contain', background: '#000' }} />
                      <span style={{ fontSize: '12px', fontWeight: idx === activeLayerIndex ? '600' : '400', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {layer.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '2px' }}>
                      <button className="btn-icon" style={{ padding: '3px' }} onClick={(e) => { e.stopPropagation(); moveLayer(idx, -1); }}>
                        <ArrowUp size={12} />
                      </button>
                      <button className="btn-icon" style={{ padding: '3px' }} onClick={(e) => { e.stopPropagation(); moveLayer(idx, 1); }}>
                        <ArrowDown size={12} />
                      </button>
                      <button className="btn-icon" style={{ padding: '3px', color: '#ef4444' }} onClick={(e) => { e.stopPropagation(); deleteLayer(idx); }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Upload Custom Image or Select Preset */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '13px', margin: 0 }}>Pustaka Decal & Upload</h4>
                <label className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '11px', gap: '6px' }}>
                  <Upload size={13} /> Upload Gambar
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '8px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`btn ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '3px 8px', fontSize: '10px', whiteSpace: 'nowrap' }}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Preset Thumbnails Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                {filteredPresets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      padding: '6px',
                      background: 'var(--bg-surface)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'border 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <img src={preset.url} alt={preset.name} style={{ width: '100%', height: '42px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {preset.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Transform & Styling Sliders */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <h4 style={{ fontSize: '13px', marginBottom: '8px' }}>Transformasi & Efek Layer</h4>

              {/* Scale Slider */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  Ukuran / Skala <span>{Math.round((currentLayer?.transform?.scale ?? 0.6) * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.8"
                  step="0.02"
                  value={currentLayer?.transform?.scale ?? 0.6}
                  onChange={(e) => updateCurrentLayer({ transform: { scale: parseFloat(e.target.value) } })}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Rotation Slider */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
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
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  Opasitas <span>{Math.round((currentLayer?.opacity ?? 1.0) * 100)}%</span>
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

              {/* Position X & Y */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Posisi X ({Math.round((currentLayer?.transform?.posX ?? 0.5) * 100)}%)</label>
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
                  <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Posisi Y ({Math.round((currentLayer?.transform?.posY ?? 0.5) * 100)}%)</label>
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

              {/* Flip & Blend Mode */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button
                  className={`btn ${currentLayer?.transform?.flipH ? 'btn-accent' : 'btn-secondary'}`}
                  style={{ padding: '6px', fontSize: '11px' }}
                  onClick={() => updateCurrentLayer({ transform: { flipH: !currentLayer?.transform?.flipH } })}
                >
                  <FlipHorizontal size={13} /> Flip H
                </button>
                <button
                  className={`btn ${currentLayer?.transform?.flipV ? 'btn-accent' : 'btn-secondary'}`}
                  style={{ padding: '6px', fontSize: '11px' }}
                  onClick={() => updateCurrentLayer({ transform: { flipV: !currentLayer?.transform?.flipV } })}
                >
                  <FlipVertical size={13} /> Flip V
                </button>
              </div>
            </div>

            {/* Apply Button */}
            <button
              className="btn btn-accent glow-pulse-cyan"
              style={{ width: '100%', padding: '12px', marginTop: 'auto', gap: '8px', fontSize: '13px' }}
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
