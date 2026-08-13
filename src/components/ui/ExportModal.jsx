import React, { useState } from 'react';
import { X, Download, Camera, Sparkles, Image, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ExportModal({ isOpen, canvasRef, onClose }) {
  const [resolution, setResolution] = useState('1080p');
  const [isTransparent, setIsTransparent] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    // Trigger confetti celebration!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (canvasRef?.current) {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Itasha_3D_Livery_Custom_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
    onClose?.();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ width: '550px', maxWidth: '90vw', borderRadius: '16px', padding: '24px' }}>

        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={20} /> Export Render 3D High-Res
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Export Configuration Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>

          {/* Resolution selector */}
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              Resolusi Gambar Export:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {['1080p', '2K QHD', '4K Ultra'].map((res) => (
                <button
                  key={res}
                  className={`btn ${resolution === res ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px', fontSize: '12px' }}
                  onClick={() => setResolution(res)}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* Background Transparency */}
          <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '13px', color: '#fff', display: 'block', fontWeight: '600' }}>Latar Belakang Transparan</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Simpan sebagai PNG transparan tanpa background 3D studio.</span>
            </div>
            <input
              type="checkbox"
              checked={isTransparent}
              onChange={(e) => setIsTransparent(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Batal
          </button>
          <button className="btn btn-accent" style={{ flex: 2, gap: '8px' }} onClick={handleDownload}>
            <Download size={18} /> Unduh Render High-Res PNG
          </button>
        </div>

      </div>
    </div>
  );
}
