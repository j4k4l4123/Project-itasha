import React from 'react';
import {
  Car, Bike, Edit3, Eye, RotateCcw, RotateCw, RefreshCw, Save, Camera, Play, Pause, Sparkles
} from 'lucide-react';
import { VEHICLE_TYPES, REAL_CAR_MODELS, REAL_MOTORCYCLE_MODELS } from '../../utils/constants';

export function Navbar({
  vehicleType,
  modelId,
  isEditMode,
  canUndo,
  canRedo,
  isTurntable,
  onSelectVehicle,
  onSelectModel,
  onToggleEditMode,
  onUndo,
  onRedo,
  onReset,
  onSaveProject,
  onExportImage,
  onToggleTurntable
}) {
  const currentModelList = vehicleType === VEHICLE_TYPES.CAR ? REAL_CAR_MODELS : REAL_MOTORCYCLE_MODELS;

  return (
    <header
      className="glass-panel"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '68px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      {/* Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-miku) 0%, var(--accent-pink) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: 'var(--shadow-neon-cyan)'
          }}
        >
          🎌
        </div>
        <div>
          <h1 style={{ fontSize: '16px', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            ITASHAVERSE <span className="badge-active" style={{ fontSize: '10px' }}>3D STUDIO PRO</span>
          </h1>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real Vehicle 3D Livery & Virtual Wrap Customizer</p>
        </div>
      </div>

      {/* Center Vehicle & Model Selector Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

        {/* Real Vehicle Selection Tabs (Mobil vs Motor) */}
        <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)', gap: '4px' }}>
          <button
            className={`btn ${vehicleType === VEHICLE_TYPES.CAR ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '13px', borderRadius: '8px' }}
            onClick={() => onSelectVehicle(VEHICLE_TYPES.CAR)}
          >
            <Car size={16} /> Mobil Real ({REAL_CAR_MODELS.length})
          </button>

          <button
            className={`btn ${vehicleType === VEHICLE_TYPES.MOTORCYCLE ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '13px', borderRadius: '8px' }}
            onClick={() => onSelectVehicle(VEHICLE_TYPES.MOTORCYCLE)}
          >
            <Bike size={16} /> Motor Real ({REAL_MOTORCYCLE_MODELS.length})
          </button>
        </div>

        {/* Model Selector Dropdown for Active Vehicle Type */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: '10px', border: '1px solid var(--accent-cyan)' }}>
          <select
            value={modelId}
            onChange={(e) => onSelectModel(e.target.value)}
            style={{
              background: 'transparent',
              color: 'var(--accent-cyan)',
              border: 'none',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none',
              paddingRight: '6px'
            }}
          >
            {currentModelList.map((m) => (
              <option key={m.id} value={m.id} style={{ background: '#0f141d', color: '#fff' }}>
                {m.badge} — {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mode Switcher: Inspect 360 vs Edit Livery */}
        <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button
            className={`btn ${!isEditMode ? 'btn-secondary' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              borderRadius: '8px',
              background: !isEditMode ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: !isEditMode ? '#fff' : 'var(--text-muted)'
            }}
            onClick={() => onToggleEditMode(false)}
          >
            <Eye size={16} /> Jelajah 360°
          </button>
          <button
            className={`btn ${isEditMode ? 'btn-accent' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              borderRadius: '8px',
              color: isEditMode ? '#fff' : 'var(--text-muted)'
            }}
            onClick={() => onToggleEditMode(true)}
          >
            <Edit3 size={16} /> Mode Edit Livery
          </button>
        </div>

      </div>

      {/* Right Controls (Undo, Redo, Reset, Turntable, Save, Export) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Undo / Redo */}
        <button className="btn-icon" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" style={{ opacity: canUndo ? 1 : 0.4 }}>
          <RotateCcw size={16} />
        </button>
        <button className="btn-icon" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)" style={{ opacity: canRedo ? 1 : 0.4 }}>
          <RotateCw size={16} />
        </button>
        <button className="btn-icon" onClick={onReset} title="Reset ke Kondisi Default Pabrik">
          <RefreshCw size={16} />
        </button>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 4px' }} />

        {/* Turntable Auto Rotate */}
        <button
          className={`btn ${isTurntable ? 'btn-accent' : 'btn-secondary'}`}
          style={{ padding: '6px 12px', fontSize: '12px' }}
          onClick={onToggleTurntable}
          title="360° Turntable Auto Rotation"
        >
          {isTurntable ? <Pause size={14} /> : <Play size={14} />} 360° View
        </button>

        {/* Save Project */}
        <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={onSaveProject} title="Simpan Project ke File JSON">
          <Save size={14} />
        </button>

        {/* Export Snapshot */}
        <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={onExportImage}>
          <Camera size={16} /> Render Export
        </button>
      </div>
    </header>
  );
}
