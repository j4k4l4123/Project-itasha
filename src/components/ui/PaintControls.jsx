import React from 'react';
import { Palette, Layers, Edit3, Lock, Shield, Sparkles, Check, Wand2, Flower2, Zap, Trophy, Flame } from 'lucide-react';
import {
  PAINT_FINISHES, DEFAULT_BODY_COLORS, CAR_PANELS, MOTORCYCLE_PANELS,
  VEHICLE_TYPES, ITA_WRAP_TEMPLATES, REAL_CAR_MODELS, REAL_MOTORCYCLE_MODELS
} from '../../utils/constants';

export function PaintControls({
  vehicleType = VEHICLE_TYPES.CAR,
  modelId = 'ferrari',
  bodyColor = '#39c5bb',
  finishKey = 'GLOSS',
  selectedPanels = [],
  panelLayers = {},
  isEditMode = false,
  onSelectColor,
  onChangeFinish,
  onTogglePanelSelection,
  onOpenLassoEditor,
  onSelectAllPanels,
  onClearPanelSelection,
  onApplyPresetWrap
}) {
  const currentPanels = vehicleType === VEHICLE_TYPES.CAR ? CAR_PANELS : MOTORCYCLE_PANELS;
  const currentModelList = vehicleType === VEHICLE_TYPES.CAR ? REAL_CAR_MODELS : REAL_MOTORCYCLE_MODELS;
  const activeModel = currentModelList.find((m) => m.id === modelId) || currentModelList[0];

  return (
    <aside
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '84px',
        left: '20px',
        width: '340px',
        maxHeight: 'calc(100vh - 108px)',
        zIndex: 90,
        borderRadius: '16px',
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {/* Active Vehicle Info Badge */}
      <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {vehicleType === VEHICLE_TYPES.CAR ? 'Mobil Real' : 'Motor Real'}
          </span>
          <span className="badge-active" style={{ fontSize: '10px' }}>{activeModel.badge}</span>
        </div>
        <h4 style={{ fontSize: '14px', color: '#fff', margin: 0 }}>{activeModel.name}</h4>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>{activeModel.description}</p>
      </div>

      {/* Section 1: Itasha Full-Wrap Templates */}
      <div>
        <h3 style={{ fontSize: '13px', color: 'var(--accent-pink)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} /> Template Itasha Full Wrap
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {ITA_WRAP_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              className="btn btn-secondary"
              onClick={() => onApplyPresetWrap?.(tpl.id)}
              style={{
                padding: '8px 12px',
                justifyContent: 'space-between',
                border: `1px solid ${tpl.accentColor}55`,
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>{tpl.name}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{tpl.tagline}</span>
              </div>
              <span className="badge-active" style={{ fontSize: '9px', whiteSpace: 'nowrap' }}>{tpl.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Paint Color & Finish */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        <h3 style={{ fontSize: '13px', color: 'var(--accent-cyan)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={16} /> Cat Dasar & Finishing
        </h3>

        {/* Finish Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '12px' }}>
          {Object.keys(PAINT_FINISHES).map((key) => {
            const finish = PAINT_FINISHES[key];
            const isActive = finishKey === key;
            return (
              <button
                key={key}
                className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 8px', fontSize: '11px' }}
                onClick={() => onChangeFinish(key)}
              >
                {finish.name}
              </button>
            );
          })}
        </div>

        {/* Preset Colors Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
          {DEFAULT_BODY_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => onSelectColor(c.hex)}
              title={c.name}
              style={{
                height: '32px',
                borderRadius: '8px',
                backgroundColor: c.hex,
                border: bodyColor.toLowerCase() === c.hex.toLowerCase() ? '2px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.2)',
                boxShadow: bodyColor.toLowerCase() === c.hex.toLowerCase() ? '0 0 10px var(--accent-cyan)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {bodyColor.toLowerCase() === c.hex.toLowerCase() && <Check size={14} color={c.hex === '#f8fafc' || c.hex === '#ffffff' ? '#000' : '#fff'} />}
            </button>
          ))}
        </div>

        {/* Custom Color Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="color"
            value={bodyColor}
            onChange={(e) => onSelectColor(e.target.value)}
            style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'none' }}
          />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Custom HEX Color: <strong style={{ color: '#fff' }}>{bodyColor}</strong></span>
        </div>
      </div>

      {/* Section 3: Body Panels Selection */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '13px', color: 'var(--accent-miku)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} /> Panel Body ({selectedPanels.length} Terpilih)
          </h3>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '10px' }} onClick={onSelectAllPanels}>
              Semua
            </button>
            <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '10px' }} onClick={onClearPanelSelection}>
              Reset
            </button>
          </div>
        </div>

        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Pilih panel untuk mendesain gambar atau klik langsung pada model 3D.
        </p>

        {/* Panel List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
          {currentPanels.map((panel) => {
            const isSelected = selectedPanels.includes(panel.id);
            const layersCount = panelLayers[panel.id]?.length || 0;

            return (
              <div
                key={panel.id}
                onClick={() => onTogglePanelSelection(panel.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(0, 243, 255, 0.15)' : 'var(--bg-surface)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--text-dim)',
                      background: isSelected ? 'var(--accent-cyan)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isSelected && <Check size={12} color="#000" />}
                  </div>
                  <span style={{ fontSize: '12px', color: isSelected ? '#fff' : 'var(--text-main)', fontWeight: isSelected ? '600' : '400' }}>
                    {panel.name}
                  </span>
                </div>

                {layersCount > 0 && (
                  <span className="badge-active" style={{ fontSize: '10px', padding: '2px 6px' }}>
                    {layersCount} layer
                  </span>
                )}
              </div>
            );
          })}

          {/* Locked Engine Item */}
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px dashed rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'not-allowed',
              opacity: 0.85
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={14} color="#f87171" />
              <span style={{ fontSize: '12px', color: '#f87171', fontWeight: '600' }}>Komponen Mesin</span>
            </div>
            <span className="badge-locked" style={{ fontSize: '9px', padding: '2px 6px' }}>
              TERKUNCI
            </span>
          </div>
        </div>
      </div>

      {/* Action Button: Edit Selected Panel with Lasso & Image Studio */}
      <button
        className="btn btn-accent glow-pulse-cyan"
        disabled={selectedPanels.length === 0}
        onClick={onOpenLassoEditor}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '13px',
          opacity: selectedPanels.length > 0 ? 1 : 0.5,
          cursor: selectedPanels.length > 0 ? 'pointer' : 'not-allowed'
        }}
      >
        <Edit3 size={16} /> Buka Studio Desain Decal & Lasso
      </button>

    </aside>
  );
}
