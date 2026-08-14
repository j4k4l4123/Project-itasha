import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  VEHICLE_TYPES, CAR_PANELS, MOTORCYCLE_PANELS, DECAL_PRESETS,
  REAL_CAR_MODELS, REAL_MOTORCYCLE_MODELS, ITA_WRAP_TEMPLATES
} from './utils/constants';
import { textureManager } from './utils/textureManager';
import { VehicleViewer } from './components/3d/VehicleViewer';
import { Navbar } from './components/ui/Navbar';
import { PaintControls } from './components/ui/PaintControls';
import { LassoCanvasEditor } from './components/editor/LassoCanvasEditor';
import { ExportModal } from './components/ui/ExportModal';
import { AlertCircle, Sparkles, Wand2, Flower2, Zap, Trophy, Mountain } from 'lucide-react';

export default function App() {
  // App State
  const [vehicleType, setVehicleType] = useState(VEHICLE_TYPES.CAR);
  const [modelId, setModelId] = useState('ferrari');
  const [isEditMode, setIsEditMode] = useState(true);
  const [bodyColor, setBodyColor] = useState('#39c5bb');
  const [finishKey, setFinishKey] = useState('GLOSS');

  const [selectedPanels, setSelectedPanels] = useState(['hood']);
  const [panelLayers, setPanelLayers] = useState({});
  const [panelTextures, setPanelTextures] = useState({});

  const [hoveredPart, setHoveredPart] = useState(null);
  const [toast, setToast] = useState(null);

  const [isLassoEditorOpen, setIsLassoEditorOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isTurntable, setIsTurntable] = useState(false);

  // Undo / Redo History Stack
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef(null);

  // Helper for notification toast
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Re-bake texture maps for all active panels when layers or body color changes
  const updateAllTextures = useCallback(async (currentLayers, currentColor) => {
    const panelsList = vehicleType === VEHICLE_TYPES.CAR ? CAR_PANELS : MOTORCYCLE_PANELS;
    const newTexturesMap = {};

    for (const panel of panelsList) {
      const layers = currentLayers[panel.id] || [];
      const texture = await textureManager.renderPanelLayers(panel.id, currentColor, layers);
      newTexturesMap[panel.id] = texture;
    }

    setPanelTextures(newTexturesMap);
  }, [vehicleType]);

  // Initial load texture setup
  useEffect(() => {
    updateAllTextures(panelLayers, bodyColor);
  }, [vehicleType, bodyColor, updateAllTextures]);

  // Push State to History Stack
  const pushHistoryState = (newPanelLayers, newBodyColor, newFinishKey) => {
    const newState = {
      vehicleType,
      modelId,
      bodyColor: newBodyColor ?? bodyColor,
      finishKey: newFinishKey ?? finishKey,
      panelLayers: JSON.parse(JSON.stringify(newPanelLayers ?? panelLayers))
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Select Vehicle Type Handler (Mobil vs Motor)
  const handleSelectVehicle = (type) => {
    setVehicleType(type);
    if (type === VEHICLE_TYPES.CAR) {
      setModelId('ferrari');
      setSelectedPanels(['hood']);
      showToast('Beralih ke Tipe Kendaraan: Mobil Real 3D', 'success');
    } else {
      setModelId('superbike');
      setSelectedPanels(['tank']);
      showToast('Beralih ke Tipe Kendaraan: Motor Real 3D', 'success');
    }
  };

  // Select Specific Model Handler
  const handleSelectModel = (mId) => {
    setModelId(mId);
    const modelList = vehicleType === VEHICLE_TYPES.CAR ? REAL_CAR_MODELS : REAL_MOTORCYCLE_MODELS;
    const mInfo = modelList.find((m) => m.id === mId);
    showToast(`Memuat Model 3D: ${mInfo ? mInfo.name : mId}`, 'success');
  };

  // Panel Selection Handlers
  const handleTogglePanelSelection = (panelId) => {
    if (selectedPanels.includes(panelId)) {
      if (selectedPanels.length > 1) {
        setSelectedPanels(selectedPanels.filter((id) => id !== panelId));
      }
    } else {
      setSelectedPanels([...selectedPanels, panelId]);
    }
  };

  const handleSelectAllPanels = () => {
    const panelsList = vehicleType === VEHICLE_TYPES.CAR ? CAR_PANELS : MOTORCYCLE_PANELS;
    setSelectedPanels(panelsList.map((p) => p.id));
  };

  const handleClearPanelSelection = () => {
    setSelectedPanels([vehicleType === VEHICLE_TYPES.CAR ? 'hood' : 'tank']);
  };

  // 3D Model Pointer Click Handler
  const handlePanelClick = (partId, isEngine) => {
    if (isEngine) {
      showToast('🔒 KOMPONEN MESIN TERKUNCI! Bagian mekanikal mesin tidak dapat dimodifikasi livery.', 'warning');
      return;
    }
    setSelectedPanels([partId]);
    if (!isEditMode) setIsEditMode(true);
  };

  // 3D Model Hover Handler
  const handlePartHover = (info) => {
    setHoveredPart(info?.id || null);
    if (info?.isEngine) {
      document.body.style.cursor = 'not-allowed';
    } else if (info) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }
  };

  // Color & Finish Change
  const handleSelectColor = (colorHex) => {
    setBodyColor(colorHex);
    pushHistoryState(panelLayers, colorHex, finishKey);
  };

  const handleChangeFinish = (key) => {
    setFinishKey(key);
    pushHistoryState(panelLayers, bodyColor, key);
  };

  // Save Layers from Lasso Studio
  const handleSaveLayersFromStudio = async (newLayers) => {
    const updatedPanelLayers = { ...panelLayers };
    selectedPanels.forEach((panelId) => {
      updatedPanelLayers[panelId] = newLayers;
    });

    setPanelLayers(updatedPanelLayers);
    await updateAllTextures(updatedPanelLayers, bodyColor);
    pushHistoryState(updatedPanelLayers, bodyColor, finishKey);
    showToast(`Livery berhasil diterapkan ke ${selectedPanels.length} panel!`, 'success');
  };

  // Undo / Redo Handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const state = history[prevIdx];
      setBodyColor(state.bodyColor);
      setFinishKey(state.finishKey);
      setPanelLayers(state.panelLayers);
      updateAllTextures(state.panelLayers, state.bodyColor);
      setHistoryIndex(prevIdx);
      showToast('Undo aksi terakhir berhasil.', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const state = history[nextIdx];
      setBodyColor(state.bodyColor);
      setFinishKey(state.finishKey);
      setPanelLayers(state.panelLayers);
      updateAllTextures(state.panelLayers, state.bodyColor);
      setHistoryIndex(nextIdx);
      showToast('Redo aksi berhasil.', 'info');
    }
  };

  // Reset to Factory Stock
  const handleReset = () => {
    const defaultColor = '#39c5bb';
    setBodyColor(defaultColor);
    setFinishKey('GLOSS');
    setPanelLayers({});
    updateAllTextures({}, defaultColor);
    showToast('Reset kendaraan ke kondisi default stock pabrik.', 'info');
  };

  // Apply Complete Full-Wrap Preset Template (Miku, Cyberpunk, Sakura, Initial D)
  const handleApplyPresetWrap = async (templateId) => {
    const tpl = ITA_WRAP_TEMPLATES.find((t) => t.id === templateId) || ITA_WRAP_TEMPLATES[0];
    const panelsList = vehicleType === VEHICLE_TYPES.CAR ? CAR_PANELS : MOTORCYCLE_PANELS;
    const newLayersMap = {};

    panelsList.forEach((p) => {
      if (tpl.layers[p.id]) {
        newLayersMap[p.id] = tpl.layers[p.id];
      } else if (p.id.startsWith('door') && tpl.layers.door_l) {
        newLayersMap[p.id] = tpl.layers.door_l;
      } else if (p.id.startsWith('fairing') && tpl.layers.fairing_l) {
        newLayersMap[p.id] = tpl.layers.fairing_l;
      }
    });

    setBodyColor(tpl.bodyColor);
    setFinishKey(tpl.finishKey);
    setPanelLayers(newLayersMap);
    await updateAllTextures(newLayersMap, tpl.bodyColor);
    pushHistoryState(newLayersMap, tpl.bodyColor, tpl.finishKey);
    showToast(`Template Itasha "${tpl.name}" Berhasil Diterapkan ke Seluruh Body!`, 'success');
  };

  // Save / Load JSON Project
  const handleSaveProject = () => {
    const projectData = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      vehicleType,
      modelId,
      bodyColor,
      finishKey,
      panelLayers
    };
    const jsonStr = JSON.stringify(projectData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Itasha_Project_${vehicleType}_${modelId}_${Date.now()}.json`;
    a.click();
    showToast('Project JSON berhasil disimpan & diunduh!', 'success');
  };

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Resolve Panel Names for UI
  const panelsList = vehicleType === VEHICLE_TYPES.CAR ? CAR_PANELS : MOTORCYCLE_PANELS;
  const selectedPanelNames = selectedPanels.map((id) => panelsList.find((p) => p.id === id)?.name || id);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>

      {/* Top Header Navigation Bar */}
      <Navbar
        vehicleType={vehicleType}
        modelId={modelId}
        isEditMode={isEditMode}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        isTurntable={isTurntable}
        onSelectVehicle={handleSelectVehicle}
        onSelectModel={handleSelectModel}
        onToggleEditMode={setIsEditMode}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        onSaveProject={handleSaveProject}
        onExportImage={() => setIsExportModalOpen(true)}
        onToggleTurntable={() => setIsTurntable(!isTurntable)}
      />

      {/* Main 3D Viewport Canvas */}
      <main style={{ width: '100%', height: '100%' }}>
        <VehicleViewer
          vehicleType={vehicleType}
          modelId={modelId}
          bodyColor={bodyColor}
          finishKey={finishKey}
          selectedPanels={selectedPanels}
          panelTextures={panelTextures}
          hoveredPart={hoveredPart}
          isTurntable={isTurntable}
          onPanelClick={handlePanelClick}
          onPartHover={handlePartHover}
          canvasRef={canvasRef}
        />
      </main>

      {/* Left Sidebar Paint & Panel Controls */}
      <PaintControls
        vehicleType={vehicleType}
        modelId={modelId}
        bodyColor={bodyColor}
        finishKey={finishKey}
        selectedPanels={selectedPanels}
        panelLayers={panelLayers}
        isEditMode={isEditMode}
        onSelectColor={handleSelectColor}
        onChangeFinish={handleChangeFinish}
        onTogglePanelSelection={handleTogglePanelSelection}
        onOpenLassoEditor={() => setIsLassoEditorOpen(true)}
        onSelectAllPanels={handleSelectAllPanels}
        onClearPanelSelection={handleClearPanelSelection}
        onApplyPresetWrap={handleApplyPresetWrap}
      />

      {/* Quick Action Floating Bar (Bottom Right Presets) */}
      <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 90, display: 'flex', gap: '10px' }}>
        <button
          className="btn btn-accent glow-pulse-cyan"
          style={{ padding: '10px 18px', fontSize: '13px' }}
          onClick={() => handleApplyPresetWrap('miku_super_gt')}
          title="Terapkan Template Full Wrap GoodSmile Miku Racing 2024"
        >
          <Wand2 size={16} /> Miku GT300 Wrap
        </button>

        <button
          className="btn btn-secondary"
          style={{ padding: '10px 16px', fontSize: '13px', border: '1px solid var(--accent-pink)', color: 'var(--accent-pink)' }}
          onClick={() => handleApplyPresetWrap('sakura_blossom')}
          title="Terapkan Template Sakura Drift Wrap"
        >
          <Flower2 size={16} /> Sakura Wrap
        </button>

        <button
          className="btn btn-secondary"
          style={{ padding: '10px 16px', fontSize: '13px', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)' }}
          onClick={() => handleApplyPresetWrap('cyberpunk_2077')}
          title="Terapkan Template Cyberpunk 2077 Wrap"
        >
          <Zap size={16} /> Cyberpunk Wrap
        </button>

        <button
          className="btn btn-secondary"
          style={{ padding: '10px 16px', fontSize: '13px', border: '1px solid #f59e0b', color: '#f59e0b' }}
          onClick={() => handleApplyPresetWrap('akina_drift')}
          title="Terapkan Template Initial D Akina Touge Wrap"
        >
          <Mountain size={16} /> Akina Touge Wrap
        </button>
      </div>

      {/* 2D Lasso & Decal Layer Studio Modal */}
      <LassoCanvasEditor
        isOpen={isLassoEditorOpen}
        selectedPanelNames={selectedPanelNames}
        initialLayers={panelLayers[selectedPanels[0]] || []}
        onSaveLayers={handleSaveLayersFromStudio}
        onClose={() => setIsLassoEditorOpen(false)}
      />

      {/* Render Export Snapshot Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        canvasRef={canvasRef}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Notification Toast */}
      {toast && (
        <div className={`toast-notification ${toast.type === 'warning' ? 'toast-warning' : 'toast-success'}`}>
          <AlertCircle size={18} />
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
