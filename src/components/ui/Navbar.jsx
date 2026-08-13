import React from 'react';
import {
  Car, Bike, Edit3, Eye, RotateCcw, RotateCw, RefreshCw, Save, Camera, Play, Pause, ChevronDown
} from 'lucide-react';
import { VEHICLE_TYPES, REAL_CAR_MODELS } from '../../utils/constants';

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
  return (
    <header
      className="glass-panel"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
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
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent-miku) 0%, var(--accent-pink) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            boxShadow: 'var(--shadow-neon-cyan)'
          }}
        >
          🥬
        </div>
        <div>
          <h1 style={{ fontSize: '16px', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            ITASHAVERSE <span className="badge-active" style={{ fontSize: '10px' }}>3D STUDIO</span>
          </h1>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real 3D Vehicle Livery & Virtual Wrap Customizer</p>
        </div>
      </div>

      {/* Center Vehicle & Model Selector Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Real Vehicle Selection Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)', gap: '4px' }}>
          <button
            className={`btn ${vehicleType === VEHICLE_TYPES.CAR ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '13px', borderRadius: '8px' }}
            onClick={() => onSelectVehicle(VEHICLE_TYPES.CAR)}
          >
            <Car size={16} /> Mobil Real 3D
          </button>

          {/* Model Selector Dropdown when Car selected */}
          {vehicleType === VEHICLE_TYPES.CAR && (
            <select
              value={modelId}
              onChange={(e) => onSelectModel(e.target.value)}
              style={{
                background: 'var(--bg-primary)',
                color: 'var(--accent-cyan)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: '6px',
                padding: '0 8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {REAL_CAR_MODELS.map((m) => (
                <option key={m.id} value={m.id} style={{ background: '#0f141d', color: '#fff' }}>
                  🏎️ {m.name}
                </option>
              ))}
            </select>
          )}

          <button
            className={`btn ${vehicleType === VEHICLE_TYPES.MOTORCYCLE ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '13px', borderRadius: '8px' }}
            onClick={() => onSelectVehicle(VEHICLE_TYPES.MOTORCYCLE)}
          >
            <Bike size={16} /> Motor Superbike
          </button>
        </div>

        {/* Mode Switcher: Inspect vs Edit */}
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

      {/* Right Controls (Undo, Redo, Save, Export) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Undo / Redo */}
        <button className="btn-icon" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" style={{ opacity: canUndo ? 1 : 0.4 }}>
          <RotateCcw size={16} />
        </button>
        <button className="btn-icon" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)" style={{ opacity: canRedo ? 1 : 0.4 }}>
          <RotateCw size={16} />
        </button>
        <button className="btn-icon" onClick={onReset} title="Reset Ke kondisi Default Stock">
          <RefreshCw size={16} />
        </button>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 4px' }} />

        {/* Turntable Auto Rotate */}
        <button
          className={`btn ${isTurntable ? 'btn-accent' : 'btn-secondary'}`}
          style={{ padding: '6px 10px', fontSize: '12px' }}
          onClick={onToggleTurntable}
          title="360° Turntable Preview"
        >
          {isTurntable ? <Pause size={14} /> : <Play size={14} />} 360° View
        </button>

        {/* Save Project */}
        <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={onSaveProject} title="Simpan Project ke JSON">
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
