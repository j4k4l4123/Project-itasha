import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { PAINT_FINISHES, REAL_MOTORCYCLE_MODELS } from '../../utils/constants';

// Preload available GLTF motorcycle models
useGLTF.preload('/models/motorcycle.glb');
useGLTF.preload('/models/vespa_scooter.glb');
useGLTF.preload('/models/nmax_motorbike.glb');

/**
 * Real 3D Motorcycle Model Component supporting 6 authentic motorcycles:
 * - Yamaha YZF-R1 / CBR1000RR Superbike (GLTF)
 * - Vespa Primavera Classic Retro Scooter (GLTF)
 * - Yamaha NMAX 155 Connected Maxi-Scooter (Authentic GLTF)
 * - Harley-Davidson Fat Boy V-Twin Cruiser (Modular)
 * - Kawasaki Z900 / Ducati Monster Naked Streetfighter (Modular)
 * - Honda CRF450 Motocross Dirt Trail Bike (Modular)
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

  // Modular Motorcycles (Cruiser, Streetfighter, Dirtbike Motocross)
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

  // GLTF Models (Superbike, Vespa Scooter, and Yamaha NMAX)
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
 * GLTF Motorcycle Renderer for Superbike, Vespa, and Yamaha NMAX
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
  const isEngineHovered = hoveredPart?.id === 'engine';
  const engineMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#232733',
    metalness: 0.9,
    roughness: 0.35,
    emissive: isEngineHovered ? '#dc2626' : '#000000',
    emissiveIntensity: isEngineHovered ? 0.5 : 0.0
  }), [isEngineHovered]);

  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1f5f9', metalness: 0.95, roughness: 0.1 }), []);
  const tireMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.95 }), []);
  
  // Protected Non-Editable Materials: Kaca, Spion, Jok, Mesin
  const seatMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1f2c',
    roughness: 0.95,
    metalness: 0.05
  }), []);

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#000000',
    transmission: 0.9,
    opacity: 0.35,
    transparent: true,
    roughness: 0.05,
    ior: 1.5
  }), []);

  const mirrorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#111827',
    roughness: 0.7,
    metalness: 0.2
  }), []);

  const mirrorGlassMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    roughness: 0.05,
    metalness: 0.98
  }), []);

  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        const meshName = (child.name || '').toLowerCase();
        const matName = (child.material?.name || '').toLowerCase();
        const parentName = (child.parent?.name || '').toLowerCase();

        // 1. Spion (Mirrors) - Protected Non-Editable
        if (
          meshName.includes('mirror') || matName.includes('mirror') || parentName.includes('mirror') ||
          parentName.includes('555942') || parentName.includes('555969') || parentName.includes('556014') ||
          parentName.includes('0668')
        ) {
          if (matName.includes('010') || matName.includes('008') || meshName.includes('glass')) {
            child.material = mirrorGlassMaterial;
          } else {
            child.material = mirrorMaterial;
          }
        }
        // 2. Kaca & Visor & Lensa Lampu - Protected Non-Editable
        else if (
          meshName.includes('glass') || matName.includes('glass') || meshName.includes('window') ||
          meshName.includes('visor') || meshName.includes('windshield') ||
          matName.includes('018') || matName.includes('0051') || parentName.includes('0051') ||
          parentName.includes('0680') || parentName.includes('0102') || parentName.includes('0100') ||
          parentName.includes('0018')
        ) {
          child.material = glassMaterial;
        }
        // 3. Jok Motor (Seat) - Protected Non-Editable
        else if (
          meshName.includes('seat') || matName.includes('seat') || meshName.includes('saddle') ||
          parentName.includes('0028') || matName.includes('017')
        ) {
          child.material = seatMaterial;
        }
        // 4. Mesin / CVT / Exhaust / Muffler - Protected Non-Editable
        else if (
          meshName.includes('engine') || matName.includes('engine') || meshName.includes('motor') ||
          meshName.includes('exhaust') || meshName.includes('muffler') || meshName.includes('cvt') ||
          meshName.includes('crank') || matName.includes('0045') || matName.includes('0075') ||
          matName.includes('0082') || parentName.includes('0045') || parentName.includes('0075') ||
          parentName.includes('0082') || parentName.includes('0033')
        ) {
          child.material = engineMaterial;
        }
        // 5. Ban & Roda
        else if (
          meshName.includes('tire') || meshName.includes('wheel') || meshName.includes('rubber') ||
          matName.includes('020') || matName.includes('026') || matName.includes('004') ||
          matName.includes('007') || parentName.includes('0016') || parentName.includes('0070') ||
          parentName.includes('0047') || parentName.includes('0092') || parentName.includes('0026') ||
          parentName.includes('0049')
        ) {
          child.material = tireMaterial;
        }
        // 6. Chrome / Cakram / Tuas
        else if (
          meshName.includes('chrome') || matName.includes('chrome') || meshName.includes('disc') ||
          matName.includes('006') || matName.includes('015') || matName.includes('0088') ||
          parentName.includes('0104') || parentName.includes('0088') || parentName.includes('0067') ||
          parentName.includes('0019') || parentName.includes('0020') || parentName.includes('0034')
        ) {
          child.material = chromeMaterial;
        }
        // 7. Paintable Body Panels & Fairings (Takes Itasha wrap and paint)
        else {
          child.material = bikePaintMaterial;
        }
      }
    });
  }, [clonedScene, bikePaintMaterial, engineMaterial, chromeMaterial, tireMaterial, seatMaterial, glassMaterial, mirrorMaterial, mirrorGlassMaterial]);

  const getPanelFromPoint = (point, meshName = '', parentName = '', matName = '') => {
    if (!point) return { id: selectedPanels[0] || 'tank', isLocked: false };
    const { x, y, z } = point;
    const lowerMesh = meshName.toLowerCase();
    const lowerParent = parentName.toLowerCase();
    const lowerMat = matName.toLowerCase();

    // 1. Spion (Mirrors) - Locked
    if (
      lowerMesh.includes('mirror') || lowerParent.includes('mirror') || lowerMat.includes('mirror') ||
      lowerParent.includes('555942') || lowerParent.includes('555969') || lowerParent.includes('556014') || lowerParent.includes('0668') ||
      (y > 1.15 && Math.abs(x) > 0.22 && z > -0.25 && z < 0.2)
    ) {
      return { id: 'mirror', isLocked: true, label: 'Spion Motor' };
    }

    // 2. Kaca & Visor - Locked
    if (
      lowerMesh.includes('glass') || lowerMat.includes('glass') || lowerMesh.includes('window') ||
      lowerMesh.includes('visor') || lowerMesh.includes('windshield') ||
      lowerMat.includes('018') || lowerMat.includes('0051') || lowerParent.includes('0051') ||
      lowerParent.includes('0680') || lowerParent.includes('0102') || lowerParent.includes('0100') ||
      lowerParent.includes('0018') || (y > 1.05 && Math.abs(x) < 0.22 && z > 0.6)
    ) {
      return { id: 'glass', isLocked: true, label: 'Kaca & Visor' };
    }

    // 3. Jok Motor (Seat) - Locked
    if (
      lowerMesh.includes('seat') || lowerMat.includes('seat') || lowerMesh.includes('saddle') ||
      lowerParent.includes('0028') || lowerMat.includes('017') ||
      (y > 0.72 && y < 1.05 && z > -0.65 && z < 0.05 && Math.abs(x) < 0.28)
    ) {
      return { id: 'seat', isLocked: true, label: 'Jok Motor' };
    }

    // 4. Mesin / CVT / Mechanical / Exhaust - Locked
    if (
      lowerMesh.includes('engine') || lowerMat.includes('engine') || lowerMesh.includes('motor') ||
      lowerMesh.includes('exhaust') || lowerMesh.includes('muffler') || lowerMesh.includes('cvt') ||
      lowerMesh.includes('crank') || lowerMat.includes('0045') || lowerMat.includes('0075') ||
      lowerMat.includes('0082') || lowerParent.includes('0045') || lowerParent.includes('0075') ||
      lowerParent.includes('0082') || lowerParent.includes('0033') ||
      (y < 0.58 && y > 0.12 && Math.abs(z) < 0.65 && Math.abs(x) < 0.4)
    ) {
      return { id: 'engine', isLocked: true, label: 'Mesin & CVT' };
    }

    // 5. Paintable Body Panels
    if (y > 0.65 && z > -0.15 && z < 0.45 && Math.abs(x) < 0.35) return { id: 'tank', isLocked: false, label: 'Bodi Tengah / Tangki' };
    if (z > 0.45 && y > 0.65) return { id: 'fairing_f', isLocked: false, label: 'Fairing Depan' };
    if (x < -0.15 && z > -0.55 && z < 0.55) return { id: 'fairing_l', isLocked: false, label: 'Fairing Kiri' };
    if (x > 0.15 && z > -0.55 && z < 0.55) return { id: 'fairing_r', isLocked: false, label: 'Fairing Kanan' };
    if (z < -0.35 && y > 0.55) return { id: 'tail', isLocked: false, label: 'Tail Cowl' };
    if (z > 0.65 && y < 0.65) return { id: 'fender_f', isLocked: false, label: 'Spakbor Depan' };

    return { id: selectedPanels[0] || 'tank', isLocked: false };
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const panel = getPanelFromPoint(e.point, e.object?.name || '', e.object?.parent?.name || '', e.object?.material?.name || '');
    onPartHover?.(panel);
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    onPartHover?.(null);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const panel = getPanelFromPoint(e.point, e.object?.name || '', e.object?.parent?.name || '', e.object?.material?.name || '');
    onPanelClick?.(panel.id, panel.isLocked, panel.label);
  };

  // Adaptive 3D Hotspots based on motorcycle model
  const panelHotspots = useMemo(() => {
    if (modelInfo.id === 'maxi_scooter') {
      return [
        { id: 'tank', pos: [0, 0.85, 0.15], label: 'Bodi Tengah / Tangki', isLocked: false },
        { id: 'fairing_f', pos: [0, 1.05, 0.9], label: 'Kedok Fairing Depan', isLocked: false },
        { id: 'fairing_l', pos: [-0.35, 0.68, 0.05], label: 'Bodi Samping Kiri', isLocked: false },
        { id: 'fairing_r', pos: [0.35, 0.68, 0.05], label: 'Bodi Samping Kanan', isLocked: false },
        { id: 'tail', pos: [0, 0.9, -0.75], label: 'Buntut / Tail Cowl', isLocked: false },
        { id: 'fender_f', pos: [0, 0.48, 1.05], label: 'Spakbor Depan', isLocked: false },
        { id: 'glass', pos: [0, 1.32, 0.75], label: '🔒 Visor Kaca (Locked)', isLocked: true },
        { id: 'mirror', pos: [-0.36, 1.35, -0.05], label: '🔒 Spion (Locked)', isLocked: true },
        { id: 'seat', pos: [0, 0.92, -0.35], label: '🔒 Jok Motor (Locked)', isLocked: true },
        { id: 'engine', pos: [-0.22, 0.42, -0.45], label: '🔒 Mesin & CVT (Locked)', isLocked: true }
      ];
    }
    if (modelInfo.id === 'vespa') {
      return [
        { id: 'tank', pos: [0, 0.85, -0.1], label: 'Bodi Monocoque', isLocked: false },
        { id: 'fairing_f', pos: [0, 0.95, 0.65], label: 'Tebeng Depan', isLocked: false },
        { id: 'fairing_l', pos: [-0.3, 0.55, -0.45], label: 'Tepong Kiri', isLocked: false },
        { id: 'fairing_r', pos: [0.3, 0.55, -0.45], label: 'Tepong Kanan', isLocked: false },
        { id: 'tail', pos: [0, 0.75, -0.75], label: 'Buntut Belakang', isLocked: false },
        { id: 'fender_f', pos: [0, 0.45, 0.75], label: 'Spakbor Depan', isLocked: false },
        { id: 'seat', pos: [0, 0.88, -0.25], label: '🔒 Jok Vespa (Locked)', isLocked: true },
        { id: 'mirror', pos: [-0.32, 1.25, 0.15], label: '🔒 Spion Chrome (Locked)', isLocked: true },
        { id: 'engine', pos: [0.15, 0.35, -0.5], label: '🔒 Mesin Matic (Locked)', isLocked: true }
      ];
    }
    // Default Superbike hotspots
    return [
      { id: 'tank', pos: [0, 0.95, 0.1], label: 'Tangki Bensin', isLocked: false },
      { id: 'fairing_f', pos: [0, 1.05, 0.85], label: 'Fairing Depan', isLocked: false },
      { id: 'fairing_l', pos: [-0.35, 0.7, 0.45], label: 'Fairing Kiri', isLocked: false },
      { id: 'fairing_r', pos: [0.35, 0.7, 0.45], label: 'Fairing Kanan', isLocked: false },
      { id: 'tail', pos: [0, 1.05, -0.75], label: 'Buntut / Tail Cowl', isLocked: false },
      { id: 'fender_f', pos: [0, 0.55, 1.15], label: 'Spakbor Depan', isLocked: false },
      { id: 'glass', pos: [0, 1.25, 0.65], label: '🔒 Windshield Kaca (Locked)', isLocked: true },
      { id: 'seat', pos: [0, 0.88, -0.25], label: '🔒 Jok Racing (Locked)', isLocked: true },
      { id: 'engine', pos: [0, 0.5, 0.05], label: '🔒 Mesin 1000cc (Locked)', isLocked: true }
    ];
  }, [modelInfo.id]);

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
        const isHovered = hoveredPart?.id === spot.id;

        return (
          <mesh
            key={spot.id}
            position={spot.pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              onPartHover?.({ id: spot.id, isLocked: !!spot.isLocked, label: spot.label });
            }}
            onPointerOut={handlePointerOut}
            onClick={(e) => {
              e.stopPropagation();
              onPanelClick?.(spot.id, !!spot.isLocked, spot.label);
            }}
          >
            <sphereGeometry args={[spot.isLocked ? 0.045 : 0.055, 16, 16]} />
            <meshStandardMaterial
              color={spot.isLocked ? '#ef4444' : (isSelected ? '#00f3ff' : (isHovered ? '#ff007f' : '#ffffff'))}
              emissive={spot.isLocked ? '#dc2626' : (isSelected ? '#00f3ff' : (isHovered ? '#ff007f' : '#222222'))}
              emissiveIntensity={isSelected ? 1.5 : (isHovered ? 1.0 : (spot.isLocked ? 0.6 : 0.3))}
              transparent
              opacity={isSelected || isHovered || spot.isLocked ? 0.9 : 0.35}
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
/**
 * Harley-Davidson Fat Boy V-Twin American Cruiser (Modular Model)
 */
function CruiserMotorcycle({ bodyColor, finish, selectedPanels, panelTextures, hoveredPart, onPanelClick, onPartHover }) {
  const createMat = (panelId) => {
    const isSelected = selectedPanels.includes(panelId);
    const isHovered = hoveredPart?.id === panelId;
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

  const isEngineHovered = hoveredPart?.id === 'engine';
  const engineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#222630', metalness: 0.9, roughness: 0.25,
    emissive: isEngineHovered ? '#dc2626' : '#000', emissiveIntensity: isEngineHovered ? 0.5 : 0
  }), [isEngineHovered]);

  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1f5f9', metalness: 0.95, roughness: 0.08 }), []);
  const tire = useMemo(() => new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.95 }), []);
  const seat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2b1b17', roughness: 0.9 }), []);
  const headlight = useMemo(() => new THREE.MeshStandardMaterial({ color: '#fffbe6', emissive: '#fffbe6', emissiveIntensity: 2 }), []);

  const hov = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPartHover?.({ id, isLocked, label }); };
  const out = (e) => { e.stopPropagation(); onPartHover?.(null); };
  const clk = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPanelClick?.(id, isLocked, label); };

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

      {/* Locked V-Twin Engine */}
      <group position={[0, 0.52, 0.0]} onPointerOver={e => hov(e, 'engine', true, 'Mesin V-Twin')} onPointerOut={out} onClick={e => clk(e, 'engine', true, 'Mesin V-Twin')}>
        <mesh material={engineMat}><boxGeometry args={[0.45, 0.38, 0.5]} /></mesh>
        <mesh position={[0, 0.22, 0.12]} rotation={[0.4, 0, 0]} material={chrome}><cylinderGeometry args={[0.08, 0.08, 0.3, 12]} /></mesh>
        <mesh position={[0, 0.22, -0.12]} rotation={[-0.4, 0, 0]} material={chrome}><cylinderGeometry args={[0.08, 0.08, 0.3, 12]} /></mesh>
        <mesh position={[0.22, -0.1, -0.15]} rotation={[0.3, 0, 0.2]} material={chrome}><cylinderGeometry args={[0.04, 0.05, 1.2, 12]} /></mesh>
      </group>

      {/* Locked Seat & Handlebars */}
      <mesh position={[0, 0.8, -0.4]} material={seat}
        onPointerOver={e => hov(e, 'seat', true, 'Jok Cruiser')} onPointerOut={out} onClick={e => clk(e, 'seat', true, 'Jok Cruiser')}>
        <boxGeometry args={[0.36, 0.1, 0.6]} />
      </mesh>
      <group position={[0, 1.05, 0.6]}
        onPointerOver={e => hov(e, 'mirror', true, 'Spion & Setang')} onPointerOut={out} onClick={e => clk(e, 'mirror', true, 'Spion & Setang')}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={chrome}><cylinderGeometry args={[0.025, 0.025, 0.75, 12]} /></mesh>
        <mesh position={[-0.38, 0.1, 0]} material={chrome}><sphereGeometry args={[0.04, 12, 12]} /></mesh>
        <mesh position={[0.38, 0.1, 0]} material={chrome}><sphereGeometry args={[0.04, 12, 12]} /></mesh>
      </group>
      {/* Locked Glass Headlight */}
      <mesh position={[0, 0.9, 1.15]} material={headlight}
        onPointerOver={e => hov(e, 'glass', true, 'Kaca Lampu Depan')} onPointerOut={out} onClick={e => clk(e, 'glass', true, 'Kaca Lampu Depan')}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>

      {/* Wheels */}
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
    const isHovered = hoveredPart?.id === panelId;
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

  const isEngineHovered = hoveredPart?.id === 'engine';
  const engineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#1e2430', metalness: 0.9, roughness: 0.3,
    emissive: isEngineHovered ? '#dc2626' : '#000', emissiveIntensity: isEngineHovered ? 0.5 : 0
  }), [isEngineHovered]);

  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#00f3ff', metalness: 0.8, roughness: 0.2 }), []);
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1f5f9', metalness: 0.95, roughness: 0.1 }), []);
  const tire = useMemo(() => new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.95 }), []);
  const seat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1f2c', roughness: 0.95 }), []);
  const headlight = useMemo(() => new THREE.MeshStandardMaterial({ color: '#00f3ff', emissive: '#00f3ff', emissiveIntensity: 2.5 }), []);

  const hov = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPartHover?.({ id, isLocked, label }); };
  const out = (e) => { e.stopPropagation(); onPartHover?.(null); };
  const clk = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPanelClick?.(id, isLocked, label); };

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

      {/* Locked Seat */}
      <mesh position={[0, 0.85, -0.25]} material={seat}
        onPointerOver={e => hov(e, 'seat', true, 'Jok Streetfighter')} onPointerOut={out} onClick={e => clk(e, 'seat', true, 'Jok Streetfighter')}>
        <boxGeometry args={[0.32, 0.1, 0.55]} />
      </mesh>

      {/* Locked Mirrors & Handlebars */}
      <group position={[0, 1.1, 0.7]}
        onPointerOver={e => hov(e, 'mirror', true, 'Spion Bar-End')} onPointerOut={out} onClick={e => clk(e, 'mirror', true, 'Spion Bar-End')}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={chrome}><cylinderGeometry args={[0.02, 0.02, 0.75, 12]} /></mesh>
        <mesh position={[-0.42, 0.05, 0]} material={chrome}><boxGeometry args={[0.08, 0.06, 0.02]} /></mesh>
        <mesh position={[0.42, 0.05, 0]} material={chrome}><boxGeometry args={[0.08, 0.06, 0.02]} /></mesh>
      </group>

      {/* Exposed Trellis Frame */}
      <mesh position={[-0.22, 0.65, 0.05]} material={frameMat}><cylinderGeometry args={[0.02, 0.02, 0.8, 12]} /></mesh>
      <mesh position={[0.22, 0.65, 0.05]} material={frameMat}><cylinderGeometry args={[0.02, 0.02, 0.8, 12]} /></mesh>

      {/* Locked Inline-4 Engine */}
      <group position={[0, 0.5, 0.05]} onPointerOver={e => hov(e, 'engine', true, 'Mesin 4-Silinder')} onPointerOut={out} onClick={e => clk(e, 'engine', true, 'Mesin 4-Silinder')}>
        <mesh material={engineMat}><boxGeometry args={[0.42, 0.38, 0.48]} /></mesh>
        <mesh position={[0.22, -0.12, -0.2]} rotation={[0.4, 0, 0]} material={chrome}><cylinderGeometry args={[0.06, 0.06, 0.5, 16]} /></mesh>
      </group>

      {/* Locked Glass Headlight */}
      <mesh position={[0, 0.9, 1.08]} material={headlight}
        onPointerOver={e => hov(e, 'glass', true, 'Lensa Lampu LED')} onPointerOut={out} onClick={e => clk(e, 'glass', true, 'Lensa Lampu LED')}>
        <boxGeometry args={[0.22, 0.14, 0.04]} />
      </mesh>

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
    const isHovered = hoveredPart?.id === panelId;
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

  const isEngineHovered = hoveredPart?.id === 'engine';
  const engineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#222630', metalness: 0.9, roughness: 0.3,
    emissive: isEngineHovered ? '#dc2626' : '#000', emissiveIntensity: isEngineHovered ? 0.5 : 0
  }), [isEngineHovered]);

  const tire = useMemo(() => new THREE.MeshStandardMaterial({ color: '#151518', roughness: 0.98 }), []);
  const seat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.95 }), []);

  const hov = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPartHover?.({ id, isLocked, label }); };
  const out = (e) => { e.stopPropagation(); onPartHover?.(null); };
  const clk = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPanelClick?.(id, isLocked, label); };

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

      {/* Locked Motocross Seat */}
      <mesh position={[0, 0.95, -0.28]} material={seat}
        onPointerOver={e => hov(e, 'seat', true, 'Jok Trail Dirtbike')} onPointerOut={out} onClick={e => clk(e, 'seat', true, 'Jok Trail Dirtbike')}>
        <boxGeometry args={[0.22, 0.1, 0.75]} />
      </mesh>

      {/* Locked Thumper Engine */}
      <group position={[0, 0.55, 0.1]} onPointerOver={e => hov(e, 'engine', true, 'Mesin Single 450cc')} onPointerOut={out} onClick={e => clk(e, 'engine', true, 'Mesin Single 450cc')}>
        <mesh material={engineMat}><boxGeometry args={[0.32, 0.4, 0.35]} /></mesh>
      </group>

      {/* Knobby Offroad Wheels */}
      <group position={[0, 0.45, 1.3]}><mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.42, 0.42, 0.12, 32]} /></mesh></group>
      <group position={[0, 0.42, -1.05]}><mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.38, 0.38, 0.16, 32]} /></mesh></group>
    </group>
  );
}

/**
 * Yamaha NMAX / Honda PCX Urban Maxi-Scooter (Modular Model Fallback)
 */
function MaxiScooterMatic({ bodyColor, finish, selectedPanels, panelTextures, hoveredPart, onPanelClick, onPartHover }) {
  const createMat = (panelId) => {
    const isSelected = selectedPanels.includes(panelId);
    const isHovered = hoveredPart?.id === panelId;
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

  const isEngineHovered = hoveredPart?.id === 'engine';
  const engineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#222630', metalness: 0.9, roughness: 0.3,
    emissive: isEngineHovered ? '#dc2626' : '#000', emissiveIntensity: isEngineHovered ? 0.5 : 0
  }), [isEngineHovered]);

  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#000', transmission: 0.9, opacity: 0.4, transparent: true, roughness: 0.05 }), []);
  const tire = useMemo(() => new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.95 }), []);
  const seat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.9 }), []);

  const hov = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPartHover?.({ id, isLocked, label }); };
  const out = (e) => { e.stopPropagation(); onPartHover?.(null); };
  const clk = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPanelClick?.(id, isLocked, label); };

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

      {/* Locked Touring Windshield Visor */}
      <mesh position={[0, 1.35, 0.95]} rotation={[-0.35, 0, 0]} material={glass}
        onPointerOver={e => hov(e, 'glass', true, 'Visor Kaca Touring')} onPointerOut={out} onClick={e => clk(e, 'glass', true, 'Visor Kaca Touring')}>
        <boxGeometry args={[0.42, 0.45, 0.04]} />
      </mesh>

      {/* Locked Dual Stepped Seat */}
      <mesh position={[0, 0.78, -0.38]} material={seat}
        onPointerOver={e => hov(e, 'seat', true, 'Jok Maxi NMAX')} onPointerOut={out} onClick={e => clk(e, 'seat', true, 'Jok Maxi NMAX')}>
        <boxGeometry args={[0.45, 0.15, 0.85]} />
      </mesh>

      {/* Locked CVT Matic Engine Box */}
      <group position={[-0.22, 0.32, -0.65]} onPointerOver={e => hov(e, 'engine', true, 'Mesin & CVT')} onPointerOut={out} onClick={e => clk(e, 'engine', true, 'Mesin & CVT')}>
        <mesh material={engineMat}><boxGeometry args={[0.18, 0.22, 0.55]} /></mesh>
      </group>

      {/* Wheels */}
      <group position={[0, 0.32, 1.25]}><mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.3, 0.3, 0.15, 32]} /></mesh></group>
      <group position={[0, 0.32, -0.85]}><mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.3, 0.3, 0.18, 32]} /></mesh></group>
    </group>
  );
}
