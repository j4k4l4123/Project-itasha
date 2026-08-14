import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { PAINT_FINISHES, REAL_MOTORCYCLE_MODELS } from '../../utils/constants';

// Preload available GLTF motorcycle models
useGLTF.preload('/models/motorcycle.glb');
useGLTF.preload('/models/vespa_scooter.glb');

/**
 * Real 3D Motorcycle Model Component supporting 6 authentic motorcycles:
 * - Yamaha YZF-R1 / CBR1000RR Superbike (GLTF)
 * - Vespa Primavera Classic Retro Scooter (GLTF)
 * - Harley-Davidson Fat Boy V-Twin Cruiser (Modular)
 * - Kawasaki Z900 / Ducati Monster Naked Streetfighter (Modular)
 * - Honda CRF450 Motocross Dirt Trail Bike (Modular)
 * - Yamaha NMAX / Honda PCX Urban Maxi-Scooter (Modular)
 */
export function MotorcycleModel({
  bodyColor = '#ff007f',
  finishKey = 'GLOSS',
  selectedPanels = [],
  panelTextures = {},
  hoveredPart = null,
  modelId = 'superbike',
  onPanelClick,
  onPartHover
}) {
  const finish = PAINT_FINISHES[finishKey] || PAINT_FINISHES.GLOSS;
  const modelInfo = REAL_MOTORCYCLE_MODELS.find((m) => m.id === modelId) || REAL_MOTORCYCLE_MODELS[0];

  // Active texture map from tank or fairings
  const compositeTexture = useMemo(() => {
    return panelTextures.tank || panelTextures.fairing_l || panelTextures.fairing_r || panelTextures.fairing_f || panelTextures.tail || null;
  }, [panelTextures]);

  // Modular Motorcycles (Cruiser, Streetfighter, Dirtbike Motocross, Maxi-Matic Scooter)
  if (modelId === 'cruiser') {
    return (
      <CruiserMotorcycle
        bodyColor={bodyColor}
        finish={finish}
        selectedPanels={selectedPanels}
        panelTextures={panelTextures}
        hoveredPart={hoveredPart}
        onPanelClick={onPanelClick}
        onPartHover={onPartHover}
      />
    );
  }

  if (modelId === 'streetfighter') {
    return (
      <NakedStreetfighter
        bodyColor={bodyColor}
        finish={finish}
        selectedPanels={selectedPanels}
        panelTextures={panelTextures}
        hoveredPart={hoveredPart}
        onPanelClick={onPanelClick}
        onPartHover={onPartHover}
      />
    );
  }

  if (modelId === 'motocross') {
    return (
      <MotocrossDirtBike
        bodyColor={bodyColor}
        finish={finish}
        selectedPanels={selectedPanels}
        panelTextures={panelTextures}
        hoveredPart={hoveredPart}
        onPanelClick={onPanelClick}
        onPartHover={onPartHover}
      />
    );
  }

  if (modelId === 'maxi_scooter') {
    return (
      <MaxiScooterMatic
        bodyColor={bodyColor}
        finish={finish}
        selectedPanels={selectedPanels}
        panelTextures={panelTextures}
        hoveredPart={hoveredPart}
        onPanelClick={onPanelClick}
        onPartHover={onPartHover}
      />
    );
  }

  // GLTF Models (Superbike & Vespa Scooter)
  return (
    <GLTFMotorcycleViewer
      modelInfo={modelInfo}
      bodyColor={bodyColor}
      finish={finish}
      selectedPanels={selectedPanels}
      panelTextures={panelTextures}
      compositeTexture={compositeTexture}
      hoveredPart={hoveredPart}
      onPanelClick={onPanelClick}
      onPartHover={onPartHover}
    />
  );
}

/**
 * GLTF Motorcycle Renderer for Superbike and Classic Vespa Scooter
 */
function GLTFMotorcycleViewer({
  modelInfo,
  bodyColor,
  finish,
  selectedPanels,
  panelTextures,
  compositeTexture,
  hoveredPart,
  onPanelClick,
  onPartHover
}) {
  const gltf = useGLTF(modelInfo.path);

  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.position.set(...modelInfo.position);
    clone.scale.setScalar(modelInfo.scale);
    return clone;
  }, [gltf.scene, modelInfo]);

  // Main Motorcycle Paint Material with Itasha texture
  const bikePaintMaterial = useMemo(() => {
    const isAnySelected = selectedPanels.length > 0;
    const isHovered = hoveredPart && !['engine'].includes(hoveredPart);

    return new THREE.MeshPhysicalMaterial({
      color: compositeTexture ? '#ffffff' : bodyColor,
      map: compositeTexture || null,
      roughness: finish.roughness,
      metalness: finish.metalness,
      clearcoat: finish.clearcoat,
      clearcoatRoughness: finish.clearcoatRoughness,
      emissive: isAnySelected ? '#00f3ff' : (isHovered ? '#ff007f' : '#000000'),
      emissiveIntensity: isAnySelected ? 0.2 : (isHovered ? 0.12 : 0.0),
      envMapIntensity: 1.8,
      side: THREE.DoubleSide
    });
  }, [bodyColor, finish, selectedPanels, hoveredPart, compositeTexture]);

  // Locked Engine Material
  const isEngineHovered = hoveredPart === 'engine';
  const engineMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#232733',
    metalness: 0.9,
    roughness: 0.35,
    emissive: isEngineHovered ? '#dc2626' : '#000000',
    emissiveIntensity: isEngineHovered ? 0.5 : 0.0
  }), [isEngineHovered]);

  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1f5f9', metalness: 0.95, roughness: 0.1 }), []);

  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        const meshName = (child.name || '').toLowerCase();
        const matName = (child.material?.name || '').toLowerCase();

        if (meshName.includes('engine') || matName.includes('engine') || meshName.includes('motor')) {
          child.material = engineMaterial;
        } else if (meshName.includes('chrome') || matName.includes('chrome') || meshName.includes('exhaust')) {
          child.material = chromeMaterial;
        } else {
          child.material = bikePaintMaterial;
        }
      }
    });
  }, [clonedScene, bikePaintMaterial, engineMaterial, chromeMaterial]);

  const getPanelFromPoint = (point) => {
    if (!point) return { id: selectedPanels[0] || 'tank', isEngine: false };
    const { x, y, z } = point;

    // Engine bay region
    if (y < 0.6 && y > 0.15 && Math.abs(z) < 0.4 && Math.abs(x) < 0.35) {
      return { id: 'engine', isEngine: true };
    }

    if (y > 0.75 && z > -0.25 && z < 0.45 && Math.abs(x) < 0.4) return { id: 'tank', isEngine: false };
    if (z > 0.45 && y > 0.7) return { id: 'fairing_f', isEngine: false };
    if (x < -0.2 && z > 0.0 && z < 0.65) return { id: 'fairing_l', isEngine: false };
    if (x > 0.2 && z > 0.0 && z < 0.65) return { id: 'fairing_r', isEngine: false };
    if (z < -0.35 && y > 0.65) return { id: 'tail', isEngine: false };
    if (z > 0.75 && y < 0.65) return { id: 'fender_f', isEngine: false };

    return { id: selectedPanels[0] || 'tank', isEngine: false };
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const panel = getPanelFromPoint(e.point);
    onPartHover?.(panel);
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    onPartHover?.(null);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const panel = getPanelFromPoint(e.point);
    onPanelClick?.(panel.id, panel.isEngine);
  };

  // Hotspots
  const panelHotspots = [
    { id: 'tank', pos: [0, 0.95, 0.1], label: 'Tangki Bensin' },
    { id: 'fairing_f', pos: [0, 1.05, 0.85], label: 'Fairing Depan' },
    { id: 'fairing_l', pos: [-0.35, 0.7, 0.45], label: 'Fairing Kiri' },
    { id: 'fairing_r', pos: [0.35, 0.7, 0.45], label: 'Fairing Kanan' },
    { id: 'tail', pos: [0, 1.05, -0.75], label: 'Buntut / Tail Cowl' },
    { id: 'fender_f', pos: [0, 0.55, 1.15], label: 'Spakbor Depan' },
    { id: 'engine', pos: [0, 0.5, 0.05], label: '🔒 Mesin (Locked)', isEngine: true }
  ];

  return (
    <group position={[0, 0, 0]}>
      <primitive
        object={clonedScene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* 3D Hotspots */}
      {panelHotspots.map((spot) => {
        const isSelected = selectedPanels.includes(spot.id);
        const isHovered = hoveredPart === spot.id;

        return (
          <mesh
            key={spot.id}
            position={spot.pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              onPartHover?.({ id: spot.id, isEngine: !!spot.isEngine });
            }}
            onPointerOut={handlePointerOut}
            onClick={(e) => {
              e.stopPropagation();
              onPanelClick?.(spot.id, !!spot.isEngine);
            }}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial
              color={spot.isEngine ? '#ef4444' : (isSelected ? '#00f3ff' : (isHovered ? '#ff007f' : '#ffffff'))}
              emissive={spot.isEngine ? '#dc2626' : (isSelected ? '#00f3ff' : (isHovered ? '#ff007f' : '#222222'))}
              emissiveIntensity={isSelected ? 1.5 : (isHovered ? 1.0 : 0.3)}
              transparent
              opacity={isSelected || isHovered || spot.isEngine ? 0.9 : 0.35}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * Harley-Davidson Fat Boy V-Twin American Cruiser (Modular Model)
 */
function CruiserMotorcycle({ bodyColor, finish, selectedPanels, panelTextures, hoveredPart, onPanelClick, onPartHover }) {
  const createMat = (panelId) => {
    const isSelected = selectedPanels.includes(panelId);
    const isHovered = hoveredPart === panelId;
    const tex = panelTextures[panelId] || null;
    return new THREE.MeshPhysicalMaterial({
      color: tex ? '#ffffff' : bodyColor, map: tex,
      roughness: finish.roughness, metalness: finish.metalness,
      clearcoat: finish.clearcoat, clearcoatRoughness: finish.clearcoatRoughness,
      emissive: isSelected ? '#00f3ff' : (isHovered ? '#ff007f' : '#000000'),
      emissiveIntensity: isSelected ? 0.35 : (isHovered ? 0.2 : 0.0),
      envMapIntensity: 1.6, side: THREE.DoubleSide
    });
  };

  const isEngineHovered = hoveredPart === 'engine';
  const engineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#222630', metalness: 0.9, roughness: 0.25,
    emissive: isEngineHovered ? '#dc2626' : '#000', emissiveIntensity: isEngineHovered ? 0.5 : 0
  }), [isEngineHovered]);

  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1f5f9', metalness: 0.95, roughness: 0.08 }), []);
  const tire = useMemo(() => new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.95 }), []);
  const seat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2b1b17', roughness: 0.9 }), []);
  const headlight = useMemo(() => new THREE.MeshStandardMaterial({ color: '#fffbe6', emissive: '#fffbe6', emissiveIntensity: 2 }), []);

  const hov = (e, id, isEngine = false) => { e.stopPropagation(); onPartHover?.({ id, isEngine }); };
  const out = (e) => { e.stopPropagation(); onPartHover?.(null); };
  const clk = (e, id, isEngine = false) => { e.stopPropagation(); onPanelClick?.(id, isEngine); };

  return (
    <group position={[0, 0, 0]}>
      {/* Teardrop Fuel Tank */}
      <mesh position={[0, 0.88, 0.15]} rotation={[-0.12, 0, 0]} material={createMat('tank')}
        onPointerOver={e => hov(e, 'tank')} onPointerOut={out} onClick={e => clk(e, 'tank')}>
        <boxGeometry args={[0.55, 0.4, 0.7]} />
      </mesh>
      {/* Front Long Cruiser Fender */}
      <mesh position={[0, 0.42, 1.2]} rotation={[-0.15, 0, 0]} material={createMat('fender_f')}
        onPointerOver={e => hov(e, 'fender_f')} onPointerOut={out} onClick={e => clk(e, 'fender_f')}>
        <boxGeometry args={[0.35, 0.08, 0.75]} />
      </mesh>
      {/* Rear Fender / Tail */}
      <mesh position={[0, 0.4, -0.8]} material={createMat('tail')}
        onPointerOver={e => hov(e, 'tail')} onPointerOut={out} onClick={e => clk(e, 'tail')}>
        <boxGeometry args={[0.45, 0.1, 0.8]} />
      </mesh>
      {/* Left Saddlebag */}
      <mesh position={[-0.35, 0.5, -0.7]} material={createMat('fairing_l')}
        onPointerOver={e => hov(e, 'fairing_l')} onPointerOut={out} onClick={e => clk(e, 'fairing_l')}>
        <boxGeometry args={[0.2, 0.3, 0.45]} />
      </mesh>
      {/* Right Saddlebag */}
      <mesh position={[0.35, 0.5, -0.7]} material={createMat('fairing_r')}
        onPointerOver={e => hov(e, 'fairing_r')} onPointerOut={out} onClick={e => clk(e, 'fairing_r')}>
        <boxGeometry args={[0.2, 0.3, 0.45]} />
      </mesh>

      {/* V-Twin Locked Engine */}
      <group position={[0, 0.52, 0.0]} onPointerOver={e => hov(e, 'engine', true)} onPointerOut={out} onClick={e => clk(e, 'engine', true)}>
        <mesh material={engineMat}><boxGeometry args={[0.45, 0.38, 0.5]} /></mesh>
        <mesh position={[0, 0.22, 0.12]} rotation={[0.4, 0, 0]} material={chrome}><cylinderGeometry args={[0.08, 0.08, 0.3, 12]} /></mesh>
        <mesh position={[0, 0.22, -0.12]} rotation={[-0.4, 0, 0]} material={chrome}><cylinderGeometry args={[0.08, 0.08, 0.3, 12]} /></mesh>
        {/* Dual chrome exhausts */}
        <mesh position={[0.22, -0.1, -0.15]} rotation={[0.3, 0, 0.2]} material={chrome}><cylinderGeometry args={[0.04, 0.05, 1.2, 12]} /></mesh>
      </group>

      {/* Seat & Handlebars */}
      <mesh position={[0, 0.8, -0.4]} material={seat}><boxGeometry args={[0.36, 0.1, 0.6]} /></mesh>
      <group position={[0, 1.05, 0.6]}><mesh rotation={[0, 0, Math.PI / 2]} material={chrome}><cylinderGeometry args={[0.025, 0.025, 0.75, 12]} /></mesh></group>
      <mesh position={[0, 0.9, 1.15]} material={headlight}><sphereGeometry args={[0.1, 16, 16]} /></mesh>

      {/* Fat Wheels */}
      <group position={[0, 0.38, 1.25]}><mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.38, 0.38, 0.18, 32]} /></mesh></group>
      <group position={[0, 0.38, -1.0]}><mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.4, 0.4, 0.25, 32]} /></mesh></group>
    </group>
  );
}

/**
 * Kawasaki Z900 / Ducati Monster Naked Streetfighter (Modular Model)
 */
function NakedStreetfighter({ bodyColor, finish, selectedPanels, panelTextures, hoveredPart, onPanelClick, onPartHover }) {
  const createMat = (panelId) => {
    const isSelected = selectedPanels.includes(panelId);
    const isHovered = hoveredPart === panelId;
    const tex = panelTextures[panelId] || null;
    return new THREE.MeshPhysicalMaterial({
      color: tex ? '#ffffff' : bodyColor, map: tex,
      roughness: finish.roughness, metalness: finish.metalness,
      clearcoat: finish.clearcoat, clearcoatRoughness: finish.clearcoatRoughness,
      emissive: isSelected ? '#00f3ff' : (isHovered ? '#ff007f' : '#000000'),
      emissiveIntensity: isSelected ? 0.35 : (isHovered ? 0.2 : 0.0),
      envMapIntensity: 1.6, side: THREE.DoubleSide
    });
  };

  const isEngineHovered = hoveredPart === 'engine';
  const engineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#1e2430', metalness: 0.9, roughness: 0.3,
    emissive: isEngineHovered ? '#dc2626' : '#000', emissiveIntensity: isEngineHovered ? 0.5 : 0
  }), [isEngineHovered]);

  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#00f3ff', metalness: 0.8, roughness: 0.2 }), []);
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1f5f9', metalness: 0.95, roughness: 0.1 }), []);
  const tire = useMemo(() => new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.95 }), []);
  const headlight = useMemo(() => new THREE.MeshStandardMaterial({ color: '#00f3ff', emissive: '#00f3ff', emissiveIntensity: 2.5 }), []);

  const hov = (e, id, isEngine = false) => { e.stopPropagation(); onPartHover?.({ id, isEngine }); };
  const out = (e) => { e.stopPropagation(); onPartHover?.(null); };
  const clk = (e, id, isEngine = false) => { e.stopPropagation(); onPanelClick?.(id, isEngine); };

  return (
    <group position={[0, 0, 0]}>
      {/* Muscular Angular Fuel Tank */}
      <mesh position={[0, 0.92, 0.1]} rotation={[-0.15, 0, 0]} material={createMat('tank')}
        onPointerOver={e => hov(e, 'tank')} onPointerOut={out} onClick={e => clk(e, 'tank')}>
        <boxGeometry args={[0.5, 0.42, 0.65]} />
      </mesh>
      {/* Aggressive Headlamp Mask */}
      <mesh position={[0, 0.9, 0.95]} rotation={[-0.2, 0, 0]} material={createMat('fairing_f')}
        onPointerOver={e => hov(e, 'fairing_f')} onPointerOut={out} onClick={e => clk(e, 'fairing_f')}>
        <boxGeometry args={[0.32, 0.3, 0.25]} />
      </mesh>
      {/* Left Radiator Shroud */}
      <mesh position={[-0.32, 0.68, 0.4]} rotation={[0, 0.2, 0]} material={createMat('fairing_l')}
        onPointerOver={e => hov(e, 'fairing_l')} onPointerOut={out} onClick={e => clk(e, 'fairing_l')}>
        <boxGeometry args={[0.1, 0.35, 0.45]} />
      </mesh>
      {/* Right Radiator Shroud */}
      <mesh position={[0.32, 0.68, 0.4]} rotation={[0, -0.2, 0]} material={createMat('fairing_r')}
        onPointerOver={e => hov(e, 'fairing_r')} onPointerOut={out} onClick={e => clk(e, 'fairing_r')}>
        <boxGeometry args={[0.1, 0.35, 0.45]} />
      </mesh>
      {/* Sharp Minimal Tail Cowl */}
      <mesh position={[0, 0.98, -0.75]} rotation={[0.2, 0, 0]} material={createMat('tail')}
        onPointerOver={e => hov(e, 'tail')} onPointerOut={out} onClick={e => clk(e, 'tail')}>
        <boxGeometry args={[0.32, 0.18, 0.65]} />
      </mesh>
      {/* Front Fender */}
      <mesh position={[0, 0.52, 1.15]} material={createMat('fender_f')}
        onPointerOver={e => hov(e, 'fender_f')} onPointerOut={out} onClick={e => clk(e, 'fender_f')}>
        <boxGeometry args={[0.24, 0.08, 0.5]} />
      </mesh>

      {/* Exposed Green/Cyan Trellis Frame */}
      <mesh position={[-0.22, 0.65, 0.05]} material={frameMat}><cylinderGeometry args={[0.02, 0.02, 0.8, 12]} /></mesh>
      <mesh position={[0.22, 0.65, 0.05]} material={frameMat}><cylinderGeometry args={[0.02, 0.02, 0.8, 12]} /></mesh>

      {/* Locked Inline-4 Engine */}
      <group position={[0, 0.5, 0.05]} onPointerOver={e => hov(e, 'engine', true)} onPointerOut={out} onClick={e => clk(e, 'engine', true)}>
        <mesh material={engineMat}><boxGeometry args={[0.42, 0.38, 0.48]} /></mesh>
        <mesh position={[0.22, -0.12, -0.2]} rotation={[0.4, 0, 0]} material={chrome}><cylinderGeometry args={[0.06, 0.06, 0.5, 16]} /></mesh>
      </group>

      <mesh position={[0, 0.9, 1.08]} material={headlight}><boxGeometry args={[0.22, 0.14, 0.04]} /></mesh>
      {/* Wheels */}
      <group position={[0, 0.35, 1.2]}><mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.35, 0.35, 0.16, 32]} /></mesh></group>
      <group position={[0, 0.35, -0.9]}><mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.36, 0.36, 0.22, 32]} /></mesh></group>
    </group>
  );
}

/**
 * Honda CRF450 Motocross Dirt Trail Bike (Modular Model)
 */
function MotocrossDirtBike({ bodyColor, finish, selectedPanels, panelTextures, hoveredPart, onPanelClick, onPartHover }) {
  const createMat = (panelId) => {
    const isSelected = selectedPanels.includes(panelId);
    const isHovered = hoveredPart === panelId;
    const tex = panelTextures[panelId] || null;
    return new THREE.MeshPhysicalMaterial({
      color: tex ? '#ffffff' : bodyColor, map: tex,
      roughness: finish.roughness, metalness: finish.metalness,
      clearcoat: finish.clearcoat, clearcoatRoughness: finish.clearcoatRoughness,
      emissive: isSelected ? '#00f3ff' : (isHovered ? '#ff007f' : '#000000'),
      emissiveIntensity: isSelected ? 0.35 : (isHovered ? 0.2 : 0.0),
      envMapIntensity: 1.5, side: THREE.DoubleSide
    });
  };

  const isEngineHovered = hoveredPart === 'engine';
  const engineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#222630', metalness: 0.9, roughness: 0.3,
    emissive: isEngineHovered ? '#dc2626' : '#000', emissiveIntensity: isEngineHovered ? 0.5 : 0
  }), [isEngineHovered]);

  const tire = useMemo(() => new THREE.MeshStandardMaterial({ color: '#151518', roughness: 0.98 }), []);
  const seat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.95 }), []);

  const hov = (e, id, isEngine = false) => { e.stopPropagation(); onPartHover?.({ id, isEngine }); };
  const out = (e) => { e.stopPropagation(); onPartHover?.(null); };
  const clk = (e, id, isEngine = false) => { e.stopPropagation(); onPanelClick?.(id, isEngine); };

  return (
    <group position={[0, 0, 0]}>
      {/* Slim Offroad Fuel Tank */}
      <mesh position={[0, 0.98, 0.15]} rotation={[-0.2, 0, 0]} material={createMat('tank')}
        onPointerOver={e => hov(e, 'tank')} onPointerOut={out} onClick={e => clk(e, 'tank')}>
        <boxGeometry args={[0.32, 0.35, 0.55]} />
      </mesh>
      {/* High Front Rally Beak Fender */}
      <mesh position={[0, 0.85, 1.25]} rotation={[-0.25, 0, 0]} material={createMat('fender_f')}
        onPointerOver={e => hov(e, 'fender_f')} onPointerOut={out} onClick={e => clk(e, 'fender_f')}>
        <boxGeometry args={[0.26, 0.06, 0.8]} />
      </mesh>
      {/* Front Number Plate Mask */}
      <mesh position={[0, 1.15, 0.88]} rotation={[-0.2, 0, 0]} material={createMat('fairing_f')}
        onPointerOver={e => hov(e, 'fairing_f')} onPointerOut={out} onClick={e => clk(e, 'fairing_f')}>
        <boxGeometry args={[0.28, 0.32, 0.05]} />
      </mesh>
      {/* Left Radiator Wing */}
      <mesh position={[-0.24, 0.78, 0.38]} material={createMat('fairing_l')}
        onPointerOver={e => hov(e, 'fairing_l')} onPointerOut={out} onClick={e => clk(e, 'fairing_l')}>
        <boxGeometry args={[0.06, 0.32, 0.4]} />
      </mesh>
      {/* Right Radiator Wing */}
      <mesh position={[0.24, 0.78, 0.38]} material={createMat('fairing_r')}
        onPointerOver={e => hov(e, 'fairing_r')} onPointerOut={out} onClick={e => clk(e, 'fairing_r')}>
        <boxGeometry args={[0.06, 0.32, 0.4]} />
      </mesh>
      {/* High Rear Fender / Tail */}
      <mesh position={[0, 1.02, -0.85]} rotation={[0.15, 0, 0]} material={createMat('tail')}
        onPointerOver={e => hov(e, 'tail')} onPointerOut={out} onClick={e => clk(e, 'tail')}>
        <boxGeometry args={[0.26, 0.06, 0.75]} />
      </mesh>

      {/* Flat Long Motocross Seat */}
      <mesh position={[0, 0.95, -0.28]} material={seat}><boxGeometry args={[0.22, 0.1, 0.75]} /></mesh>

      {/* Single Cylinder Locked Thumper Engine */}
      <group position={[0, 0.55, 0.1]} onPointerOver={e => hov(e, 'engine', true)} onPointerOut={out} onClick={e => clk(e, 'engine', true)}>
        <mesh material={engineMat}><boxGeometry args={[0.32, 0.4, 0.35]} /></mesh>
      </group>

      {/* Knobby Offroad Wheels */}
      <group position={[0, 0.45, 1.3]}><mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.42, 0.42, 0.12, 32]} /></mesh></group>
      <group position={[0, 0.42, -1.05]}><mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.38, 0.38, 0.16, 32]} /></mesh></group>
    </group>
  );
}

/**
 * Yamaha NMAX / Honda PCX Urban Maxi-Scooter (Modular Model)
 */
function MaxiScooterMatic({ bodyColor, finish, selectedPanels, panelTextures, hoveredPart, onPanelClick, onPartHover }) {
  const createMat = (panelId) => {
    const isSelected = selectedPanels.includes(panelId);
    const isHovered = hoveredPart === panelId;
    const tex = panelTextures[panelId] || null;
    return new THREE.MeshPhysicalMaterial({
      color: tex ? '#ffffff' : bodyColor, map: tex,
      roughness: finish.roughness, metalness: finish.metalness,
      clearcoat: finish.clearcoat, clearcoatRoughness: finish.clearcoatRoughness,
      emissive: isSelected ? '#00f3ff' : (isHovered ? '#ff007f' : '#000000'),
      emissiveIntensity: isSelected ? 0.35 : (isHovered ? 0.2 : 0.0),
      envMapIntensity: 1.6, side: THREE.DoubleSide
    });
  };

  const isEngineHovered = hoveredPart === 'engine';
  const engineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#222630', metalness: 0.9, roughness: 0.3,
    emissive: isEngineHovered ? '#dc2626' : '#000', emissiveIntensity: isEngineHovered ? 0.5 : 0
  }), [isEngineHovered]);

  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#000', transmission: 0.9, opacity: 0.4, transparent: true, roughness: 0.05 }), []);
  const tire = useMemo(() => new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.95 }), []);
  const seat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.9 }), []);

  const hov = (e, id, isEngine = false) => { e.stopPropagation(); onPartHover?.({ id, isEngine }); };
  const out = (e) => { e.stopPropagation(); onPartHover?.(null); };
  const clk = (e, id, isEngine = false) => { e.stopPropagation(); onPanelClick?.(id, isEngine); };

  return (
    <group position={[0, 0, 0]}>
      {/* Center Backbone Tunnel / Tank */}
      <mesh position={[0, 0.65, 0.15]} material={createMat('tank')}
        onPointerOver={e => hov(e, 'tank')} onPointerOut={out} onClick={e => clk(e, 'tank')}>
        <boxGeometry args={[0.35, 0.35, 0.65]} />
      </mesh>
      {/* Aerodynamic Front Cowl Mask */}
      <mesh position={[0, 0.92, 0.95]} rotation={[-0.3, 0, 0]} material={createMat('fairing_f')}
        onPointerOver={e => hov(e, 'fairing_f')} onPointerOut={out} onClick={e => clk(e, 'fairing_f')}>
        <boxGeometry args={[0.55, 0.6, 0.45]} />
      </mesh>
      {/* Left Body Panel */}
      <mesh position={[-0.32, 0.55, -0.45]} material={createMat('fairing_l')}
        onPointerOver={e => hov(e, 'fairing_l')} onPointerOut={out} onClick={e => clk(e, 'fairing_l')}>
        <boxGeometry args={[0.1, 0.45, 0.95]} />
      </mesh>
      {/* Right Body Panel */}
      <mesh position={[0.32, 0.55, -0.45]} material={createMat('fairing_r')}
        onPointerOver={e => hov(e, 'fairing_r')} onPointerOut={out} onClick={e => clk(e, 'fairing_r')}>
        <boxGeometry args={[0.1, 0.45, 0.95]} />
      </mesh>
      {/* Rear Tail Cowl */}
      <mesh position={[0, 0.72, -0.95]} rotation={[0.15, 0, 0]} material={createMat('tail')}
        onPointerOver={e => hov(e, 'tail')} onPointerOut={out} onClick={e => clk(e, 'tail')}>
        <boxGeometry args={[0.42, 0.25, 0.45]} />
      </mesh>
      {/* Front Fender */}
      <mesh position={[0, 0.45, 1.2]} material={createMat('fender_f')}
        onPointerOver={e => hov(e, 'fender_f')} onPointerOut={out} onClick={e => clk(e, 'fender_f')}>
        <boxGeometry args={[0.26, 0.08, 0.55]} />
      </mesh>

      {/* Touring Windshield Visor */}
      <mesh position={[0, 1.35, 0.95]} rotation={[-0.35, 0, 0]} material={glass}><boxGeometry args={[0.42, 0.45, 0.04]} /></mesh>

      {/* Wide Dual Stepped Seat */}
      <mesh position={[0, 0.78, -0.38]} material={seat}><boxGeometry args={[0.45, 0.15, 0.85]} /></mesh>

      {/* Locked CVT Matic Engine Box */}
      <group position={[-0.22, 0.32, -0.65]} onPointerOver={e => hov(e, 'engine', true)} onPointerOut={out} onClick={e => clk(e, 'engine', true)}>
        <mesh material={engineMat}><boxGeometry args={[0.18, 0.22, 0.55]} /></mesh>
      </group>

      {/* Wheels */}
      <group position={[0, 0.32, 1.25]}><mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.3, 0.3, 0.15, 32]} /></mesh></group>
      <group position={[0, 0.32, -0.85]}><mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.3, 0.3, 0.18, 32]} /></mesh></group>
    </group>
  );
}
