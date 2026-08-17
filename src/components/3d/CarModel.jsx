import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { PAINT_FINISHES, REAL_CAR_MODELS } from '../../utils/constants';

// Preload available GLTF models
useGLTF.preload('/models/ferrari.glb');
useGLTF.preload('/models/porsche.glb');
useGLTF.preload('/models/compact_car.glb');
useGLTF.preload('/models/truck.glb');
useGLTF.preload('/models/toycar.glb');

/**
 * Real 3D Car Model Component supporting authentic GLTF/GLB models & modular real vehicles
 * (Ferrari 458 Italia GT, Porsche 718 Boxster, Honda Jazz/Compact Car, Kei Truck, Nissan S15 Cyber GT, Toyota AE86, Lancer Evo Sedan).
 */
export function CarModel({
  bodyColor = '#39c5bb',
  finishKey = 'GLOSS',
  selectedPanels = [],
  panelTextures = {},
  hoveredPart = null,
  modelId = 'ferrari',
  onPanelClick,
  onPartHover
}) {
  const groupRef = useRef();
  const finish = PAINT_FINISHES[finishKey] || PAINT_FINISHES.GLOSS;
  const modelInfo = REAL_CAR_MODELS.find((m) => m.id === modelId) || REAL_CAR_MODELS[0];

  // Primary active texture map (from hood, doors, or roof)
  const compositeTexture = useMemo(() => {
    return panelTextures.hood || panelTextures.door_l || panelTextures.roof || panelTextures.door_r || panelTextures.fender_l || null;
  }, [panelTextures]);

  // Handle Modular Cars (AE86 and Sport Sedan) separately for 100% individual panel wrapping precision
  if (modelId === 'ae86') {
    return (
      <AE86DriftModel
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

  if (modelId === 'sedan') {
    return (
      <RallySedanModel
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

  // Load GLTF model dynamically for authentic car models
  return (
    <GLTFCarViewer
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
 * GLTF Real Car Renderer for Ferrari, Porsche, Compact Car, Truck, ToyCar
 */
function GLTFCarViewer({
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

  // Clone GLTF scene to ensure per-instance material assignment
  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.position.set(...modelInfo.position);
    clone.scale.setScalar(modelInfo.scale);
    return clone;
  }, [gltf.scene, modelInfo]);

  // Main Car Paint Material with active Itasha texture applied
  const carPaintMaterial = useMemo(() => {
    const isAnySelected = selectedPanels.length > 0;
    const isHovered = hoveredPart && !['engine'].includes(hoveredPart);

    return new THREE.MeshPhysicalMaterial({
      color: compositeTexture ? '#ffffff' : bodyColor,
      map: compositeTexture || null,
      roughness: finish.roughness,
      metalness: finish.metalness,
      clearcoat: finish.clearcoat,
      clearcoatRoughness: finish.clearcoatRoughness,
      emissive: isAnySelected ? '#00f3ff' : (isHovered ? '#39c5bb' : '#000000'),
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

  // Glass Material
  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#000000',
    transmission: 0.92,
    opacity: 0.35,
    transparent: true,
    roughness: 0.05,
    ior: 1.5
  }), []);

  // Chrome & Carbon Trim
  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1f5f9', metalness: 0.95, roughness: 0.1 }), []);
  const carbonMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.5, metalness: 0.3 }), []);

  // Update materials on cloned GLTF mesh tree
  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        const meshName = (child.name || '').toLowerCase();
        const matName = (child.material?.name || '').toLowerCase();
        const parentName = (child.parent?.name || '').toLowerCase();

        // 1. Engine / Mechanical parts (Locked)
        if (meshName.includes('metal') || meshName.includes('engine') || matName.includes('engine') || parentName.includes('engine')) {
          child.material = engineMaterial;
        }
        // 2. Glass / Windows (Locked)
        else if (meshName.includes('glass') || matName.includes('glass') || meshName.includes('window') || meshName.includes('windshield')) {
          child.material = glassMaterial;
        }
        // 3. Spion / Mirrors (Locked)
        else if (meshName.includes('mirror') || matName.includes('mirror') || parentName.includes('mirror')) {
          child.material = carbonMaterial;
        }
        // 4. Seats / Interior (Locked)
        else if (meshName.includes('seat') || matName.includes('seat') || meshName.includes('interior') || matName.includes('interior')) {
          child.material = carbonMaterial;
        }
        // 5. Carbon Fibre Trim
        else if (meshName.includes('carbon') || matName.includes('carbon')) {
          child.material = carbonMaterial;
        }
        // 6. Chrome / Exhaust / Grill
        else if (meshName.includes('chrome') || matName.includes('chrome') || meshName.includes('grills')) {
          child.material = chromeMaterial;
        }
        // 7. Main Car Paint & Body Panels (takes Itasha paint & texture)
        else if (
          meshName.includes('body') ||
          matName.includes('body') ||
          matName.includes('paint') ||
          matName.includes('carmat') ||
          matName.includes('truck') ||
          matName.includes('toycar') ||
          meshName.includes('trim') ||
          meshName.includes('car') ||
          meshName.includes('cesium')
        ) {
          child.material = carPaintMaterial;
        }
      }
    });
  }, [clonedScene, carPaintMaterial, engineMaterial, glassMaterial, carbonMaterial, chromeMaterial]);

  // Click & Hover raycast detection
  const getPanelFromPoint = (point, meshName = '', parentName = '', matName = '') => {
    if (!point) return { id: selectedPanels[0] || 'hood', isLocked: false };
    const { x, y, z } = point;
    const lowerMesh = meshName.toLowerCase();
    const lowerParent = parentName.toLowerCase();
    const lowerMat = matName.toLowerCase();

    // 1. Spion (Mirrors)
    if (
      lowerMesh.includes('mirror') || lowerParent.includes('mirror') || lowerMat.includes('mirror') ||
      (y > 0.8 && y < 1.15 && Math.abs(x) > 0.85 && z > -0.2 && z < 0.3)
    ) {
      return { id: 'mirror', isLocked: true, label: 'Spion Mobil' };
    }

    // 2. Kaca (Windows / Windshield)
    if (
      lowerMesh.includes('glass') || lowerMat.includes('glass') || lowerMesh.includes('window') ||
      (y > 0.95 && y < 1.35 && Math.abs(x) < 0.75 && z > -0.8 && z < 0.5)
    ) {
      return { id: 'glass', isLocked: true, label: 'Kaca Mobil' };
    }

    // 3. Kursi / Interior
    if (
      lowerMesh.includes('seat') || lowerMat.includes('seat') || lowerMesh.includes('interior') ||
      (y < 0.9 && y > 0.3 && Math.abs(x) < 0.5 && z < 0.2 && z > -0.6)
    ) {
      return { id: 'seat', isLocked: true, label: 'Interior & Kursi' };
    }

    // 4. Mesin / Engine bay
    if (
      lowerMesh.includes('metal') || lowerMesh.includes('engine') || lowerMat.includes('engine') ||
      (z < -0.2 && z > -1.0 && y > 0.4 && y < 0.95 && Math.abs(x) < 0.45)
    ) {
      return { id: 'engine', isLocked: true, label: 'Mesin Mobil' };
    }

    // 5. Paintable Panels
    if (z > 0.3 && y > 0.35 && Math.abs(x) < 0.65) return { id: 'hood', isLocked: false, label: 'Kap Mesin' };
    if (y > 0.95 && z < 0.3 && z > -0.65 && Math.abs(x) < 0.65) return { id: 'roof', isLocked: false, label: 'Atap' };
    if (x < -0.5 && z < 0.4 && z > -0.5) return { id: 'door_l', isLocked: false, label: 'Pintu Kiri' };
    if (x > 0.5 && z < 0.4 && z > -0.5) return { id: 'door_r', isLocked: false, label: 'Pintu Kanan' };
    if (z > 1.2) return { id: 'bumper_f', isLocked: false, label: 'Bumper Depan' };
    if (z < -1.3) return { id: 'bumper_r', isLocked: false, label: 'Bumper Belakang' };
    if (z < -1.0 && y > 0.8) return { id: 'spoiler', isLocked: false, label: 'Spoiler' };
    if (x < -0.5 && z > 0.4) return { id: 'fender_l', isLocked: false, label: 'Fender Kiri' };
    if (x > 0.5 && z > 0.4) return { id: 'fender_r', isLocked: false, label: 'Fender Kanan' };

    return { id: selectedPanels[0] || 'hood', isLocked: false };
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

  // 3D Hotspot markers for intuitive panel clicking
  const panelHotspots = [
    { id: 'hood', pos: [0, 0.75, 0.9], label: 'Kap Mesin', isLocked: false },
    { id: 'roof', pos: [0, 1.35, -0.3], label: 'Atap', isLocked: false },
    { id: 'door_l', pos: [-0.9, 0.65, -0.15], label: 'Pintu Kiri', isLocked: false },
    { id: 'door_r', pos: [0.9, 0.65, -0.15], label: 'Pintu Kanan', isLocked: false },
    { id: 'bumper_f', pos: [0, 0.4, 1.75], label: 'Bumper Depan', isLocked: false },
    { id: 'bumper_r', pos: [0, 0.5, -1.8], label: 'Bumper Belakang', isLocked: false },
    { id: 'spoiler', pos: [0, 1.25, -1.65], label: 'Spoiler', isLocked: false },
    { id: 'glass', pos: [0, 1.15, 0.35], label: '🔒 Kaca Depan (Locked)', isLocked: true },
    { id: 'mirror', pos: [-0.98, 0.92, 0.25], label: '🔒 Spion (Locked)', isLocked: true },
    { id: 'engine', pos: [0, 0.6, -0.6], label: '🔒 Mesin (Locked)', isLocked: true }
  ];

  return (
    <group position={[0, 0, 0]}>
      <primitive
        object={clonedScene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* 3D Hotspot markers */}
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
            <sphereGeometry args={[spot.isLocked ? 0.045 : 0.06, 16, 16]} />
            <meshStandardMaterial
              color={spot.isLocked ? '#ef4444' : (isSelected ? '#00f3ff' : (isHovered ? '#39c5bb' : '#ffffff'))}
              emissive={spot.isLocked ? '#dc2626' : (isSelected ? '#00f3ff' : (isHovered ? '#39c5bb' : '#222222'))}
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
 * Toyota Sprinter Trueno AE86 JDM Drift Coupe (Modular High-Detail Model)
 */
function AE86DriftModel({
  bodyColor,
  finish,
  selectedPanels,
  panelTextures,
  hoveredPart,
  onPanelClick,
  onPartHover
}) {
  const createPanelMat = (panelId) => {
    const isSelected = selectedPanels.includes(panelId);
    const isHovered = hoveredPart?.id === panelId;
    const tex = panelTextures[panelId] || null;

    return new THREE.MeshPhysicalMaterial({
      color: tex ? '#ffffff' : bodyColor,
      map: tex,
      roughness: finish.roughness,
      metalness: finish.metalness,
      clearcoat: finish.clearcoat,
      clearcoatRoughness: finish.clearcoatRoughness,
      emissive: isSelected ? '#00f3ff' : (isHovered ? '#39c5bb' : '#000000'),
      emissiveIntensity: isSelected ? 0.35 : (isHovered ? 0.2 : 0.0),
      envMapIntensity: 1.6,
      side: THREE.DoubleSide
    });
  };

  const isEngineHovered = hoveredPart?.id === 'engine';
  const engineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#222630',
    metalness: 0.9,
    roughness: 0.3,
    emissive: isEngineHovered ? '#dc2626' : '#000000',
    emissiveIntensity: isEngineHovered ? 0.5 : 0.0
  }), [isEngineHovered]);

  const redCamCover = useMemo(() => new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.4 }), []);
  const blackTrim = useMemo(() => new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.8 }), []);
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1f5f9', metalness: 0.95, roughness: 0.1 }), []);
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#000', transmission: 0.9, opacity: 0.4, transparent: true, roughness: 0.05, ior: 1.5 }), []);
  const tire = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.95 }), []);
  const headlight = useMemo(() => new THREE.MeshStandardMaterial({ color: '#fffbe6', emissive: '#fffbe6', emissiveIntensity: 2.5 }), []);
  const taillight = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ff0033', emissive: '#ff0033', emissiveIntensity: 2 }), []);

  const hov = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPartHover?.({ id, isLocked, label }); };
  const out = (e) => { e.stopPropagation(); onPartHover?.(null); };
  const clk = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPanelClick?.(id, isLocked, label); };

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Hood (Kap Mesin) */}
      <mesh position={[0, 0.65, 0.95]} rotation={[-0.1, 0, 0]} material={createPanelMat('hood')}
        onPointerOver={e => hov(e, 'hood')} onPointerOut={out} onClick={e => clk(e, 'hood')}>
        <boxGeometry args={[1.5, 0.06, 1.3]} />
      </mesh>

      {/* 2. Roof (Atap) */}
      <mesh position={[0, 1.15, -0.25]} material={createPanelMat('roof')}
        onPointerOver={e => hov(e, 'roof')} onPointerOut={out} onClick={e => clk(e, 'roof')}>
        <boxGeometry args={[1.35, 0.06, 1.4]} />
      </mesh>

      {/* 3. Left Door (Pintu Kiri) */}
      <mesh position={[-0.78, 0.6, -0.15]} material={createPanelMat('door_l')}
        onPointerOver={e => hov(e, 'door_l')} onPointerOut={out} onClick={e => clk(e, 'door_l')}>
        <boxGeometry args={[0.07, 0.55, 1.4]} />
      </mesh>

      {/* 4. Right Door (Pintu Kanan - Fujiwara Tofu) */}
      <mesh position={[0.78, 0.6, -0.15]} material={createPanelMat('door_r')}
        onPointerOver={e => hov(e, 'door_r')} onPointerOut={out} onClick={e => clk(e, 'door_r')}>
        <boxGeometry args={[0.07, 0.55, 1.4]} />
      </mesh>

      {/* 5. Left Fender */}
      <mesh position={[-0.8, 0.55, 1.05]} material={createPanelMat('fender_l')}
        onPointerOver={e => hov(e, 'fender_l')} onPointerOut={out} onClick={e => clk(e, 'fender_l')}>
        <boxGeometry args={[0.08, 0.5, 0.9]} />
      </mesh>

      {/* 6. Right Fender */}
      <mesh position={[0.8, 0.55, 1.05]} material={createPanelMat('fender_r')}
        onPointerOver={e => hov(e, 'fender_r')} onPointerOut={out} onClick={e => clk(e, 'fender_r')}>
        <boxGeometry args={[0.08, 0.5, 0.9]} />
      </mesh>

      {/* 7. Front Bumper */}
      <mesh position={[0, 0.32, 1.72]} material={createPanelMat('bumper_f')}
        onPointerOver={e => hov(e, 'bumper_f')} onPointerOut={out} onClick={e => clk(e, 'bumper_f')}>
        <boxGeometry args={[1.65, 0.36, 0.35]} />
      </mesh>

      {/* 8. Rear Bumper */}
      <mesh position={[0, 0.38, -1.7]} material={createPanelMat('bumper_r')}
        onPointerOver={e => hov(e, 'bumper_r')} onPointerOut={out} onClick={e => clk(e, 'bumper_r')}>
        <boxGeometry args={[1.6, 0.42, 0.35]} />
      </mesh>

      {/* 9. Rear Ducktail Spoiler / Trunk */}
      <mesh position={[0, 0.78, -1.45]} rotation={[0.08, 0, 0]} material={createPanelMat('spoiler')}
        onPointerOver={e => hov(e, 'spoiler')} onPointerOut={out} onClick={e => clk(e, 'spoiler')}>
        <boxGeometry args={[1.4, 0.08, 0.7]} />
      </mesh>

      {/* 10. Side Skirts */}
      <mesh position={[-0.8, 0.22, -0.1]} material={createPanelMat('skirt_l')}
        onPointerOver={e => hov(e, 'skirt_l')} onPointerOut={out} onClick={e => clk(e, 'skirt_l')}>
        <boxGeometry args={[0.08, 0.12, 1.6]} />
      </mesh>
      <mesh position={[0.8, 0.22, -0.1]} material={createPanelMat('skirt_r')}
        onPointerOver={e => hov(e, 'skirt_r')} onPointerOut={out} onClick={e => clk(e, 'skirt_r')}>
        <boxGeometry args={[0.08, 0.12, 1.6]} />
      </mesh>

      {/* === LOCKED 4A-GE ENGINE BAY === */}
      <group position={[0, 0.48, 0.95]} onPointerOver={e => hov(e, 'engine', true, 'Mesin 4A-GE Twin Cam')} onPointerOut={out} onClick={e => clk(e, 'engine', true, 'Mesin 4A-GE Twin Cam')}>
        <mesh material={engineMat}><boxGeometry args={[0.75, 0.3, 0.6]} /></mesh>
        {/* Red Twin-Cam Cover */}
        <mesh position={[0, 0.18, 0]} material={redCamCover}><boxGeometry args={[0.45, 0.08, 0.4]} /></mesh>
        <mesh position={[-0.22, 0.12, 0.15]} material={chrome}><cylinderGeometry args={[0.08, 0.08, 0.15, 16]} /></mesh>
      </group>

      {/* Locked Glass / Windows */}
      <group onPointerOver={e => hov(e, 'glass', true, 'Kaca AE86')} onPointerOut={out} onClick={e => clk(e, 'glass', true, 'Kaca AE86')}>
        <mesh position={[0, 0.92, 0.48]} rotation={[-0.5, 0, 0]} material={glass}><boxGeometry args={[1.32, 0.04, 0.65]} /></mesh>
        <mesh position={[0, 0.96, -0.98]} rotation={[0.45, 0, 0]} material={glass}><boxGeometry args={[1.28, 0.04, 0.6]} /></mesh>
        <mesh position={[-0.74, 0.9, -0.22]} material={glass}><boxGeometry args={[0.03, 0.35, 1.1]} /></mesh>
        <mesh position={[0.74, 0.9, -0.22]} material={glass}><boxGeometry args={[0.03, 0.35, 1.1]} /></mesh>
      </group>

      {/* Pop-Up Headlights (AE86 signature) */}
      <group position={[-0.52, 0.68, 1.62]} rotation={[-0.25, 0, 0]}>
        <mesh material={blackTrim}><boxGeometry args={[0.32, 0.14, 0.22]} /></mesh>
        <mesh position={[0, 0, 0.11]} material={headlight}><boxGeometry args={[0.26, 0.09, 0.04]} /></mesh>
      </group>
      <group position={[0.52, 0.68, 1.62]} rotation={[-0.25, 0, 0]}>
        <mesh material={blackTrim}><boxGeometry args={[0.32, 0.14, 0.22]} /></mesh>
        <mesh position={[0, 0, 0.11]} material={headlight}><boxGeometry args={[0.26, 0.09, 0.04]} /></mesh>
      </group>

      {/* Taillights */}
      <mesh position={[-0.5, 0.55, -1.82]} material={taillight}><boxGeometry args={[0.38, 0.12, 0.06]} /></mesh>
      <mesh position={[0.5, 0.55, -1.82]} material={taillight}><boxGeometry args={[0.38, 0.12, 0.06]} /></mesh>

      {/* Wheels (Watanabe 8-spoke style) */}
      {[[-0.8, 0.3, 1.15], [0.8, 0.3, 1.15], [-0.8, 0.3, -1.2], [0.8, 0.3, -1.2]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.3, 0.3, 0.24, 32]} /></mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} material={chrome}><cylinderGeometry args={[0.2, 0.2, 0.25, 16]} /></mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Mitsubishi Lancer Evolution / WRX STi Sport Sedan (Modular High-Detail Model)
 */
function RallySedanModel({
  bodyColor,
  finish,
  selectedPanels,
  panelTextures,
  hoveredPart,
  onPanelClick,
  onPartHover
}) {
  const createPanelMat = (panelId) => {
    const isSelected = selectedPanels.includes(panelId);
    const isHovered = hoveredPart?.id === panelId;
    const tex = panelTextures[panelId] || null;

    return new THREE.MeshPhysicalMaterial({
      color: tex ? '#ffffff' : bodyColor,
      map: tex,
      roughness: finish.roughness,
      metalness: finish.metalness,
      clearcoat: finish.clearcoat,
      clearcoatRoughness: finish.clearcoatRoughness,
      emissive: isSelected ? '#00f3ff' : (isHovered ? '#39c5bb' : '#000000'),
      emissiveIntensity: isSelected ? 0.35 : (isHovered ? 0.2 : 0.0),
      envMapIntensity: 1.6,
      side: THREE.DoubleSide
    });
  };

  const isEngineHovered = hoveredPart?.id === 'engine';
  const engineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#272a33',
    metalness: 0.9,
    roughness: 0.3,
    emissive: isEngineHovered ? '#dc2626' : '#000',
    emissiveIntensity: isEngineHovered ? 0.5 : 0.0
  }), [isEngineHovered]);

  const carbonMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.5, metalness: 0.3 }), []);
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1f5f9', metalness: 0.95, roughness: 0.1 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.8 }), []);
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#000', transmission: 0.9, opacity: 0.4, transparent: true, roughness: 0.05, ior: 1.5 }), []);
  const headlight = useMemo(() => new THREE.MeshStandardMaterial({ color: '#00f3ff', emissive: '#00f3ff', emissiveIntensity: 2.5 }), []);
  const taillight = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ff0055', emissive: '#ff0055', emissiveIntensity: 2.5 }), []);
  const tire = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.95 }), []);

  const hov = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPartHover?.({ id, isLocked, label }); };
  const out = (e) => { e.stopPropagation(); onPartHover?.(null); };
  const clk = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPanelClick?.(id, isLocked, label); };

  return (
    <group position={[0, 0, 0]}>
      {/* Vented Rally Hood */}
      <mesh position={[0, 0.72, 1.1]} rotation={[-0.08, 0, 0]} material={createPanelMat('hood')}
        onPointerOver={e => hov(e, 'hood')} onPointerOut={out} onClick={e => clk(e, 'hood')}>
        <boxGeometry args={[1.65, 0.07, 1.25]} />
      </mesh>
      {/* Hood Vent Scoop */}
      <mesh position={[0, 0.78, 1.15]} material={carbonMat}><boxGeometry args={[0.5, 0.06, 0.4]} /></mesh>

      {/* Roof */}
      <mesh position={[0, 1.22, -0.2]} material={createPanelMat('roof')}
        onPointerOver={e => hov(e, 'roof')} onPointerOut={out} onClick={e => clk(e, 'roof')}>
        <boxGeometry args={[1.5, 0.07, 1.65]} />
      </mesh>

      {/* Doors Left & Right */}
      <mesh position={[-0.86, 0.65, -0.1]} material={createPanelMat('door_l')}
        onPointerOver={e => hov(e, 'door_l')} onPointerOut={out} onClick={e => clk(e, 'door_l')}>
        <boxGeometry args={[0.07, 0.6, 1.65]} />
      </mesh>
      <mesh position={[0.86, 0.65, -0.1]} material={createPanelMat('door_r')}
        onPointerOver={e => hov(e, 'door_r')} onPointerOut={out} onClick={e => clk(e, 'door_r')}>
        <boxGeometry args={[0.07, 0.6, 1.65]} />
      </mesh>

      {/* Flared Fenders */}
      <mesh position={[-0.88, 0.6, 1.1]} material={createPanelMat('fender_l')}
        onPointerOver={e => hov(e, 'fender_l')} onPointerOut={out} onClick={e => clk(e, 'fender_l')}>
        <boxGeometry args={[0.1, 0.55, 1.05]} />
      </mesh>
      <mesh position={[0.88, 0.6, 1.1]} material={createPanelMat('fender_r')}
        onPointerOver={e => hov(e, 'fender_r')} onPointerOut={out} onClick={e => clk(e, 'fender_r')}>
        <boxGeometry args={[0.1, 0.55, 1.05]} />
      </mesh>

      {/* Aggressive Front Splitter Bumper */}
      <mesh position={[0, 0.38, 1.82]} material={createPanelMat('bumper_f')}
        onPointerOver={e => hov(e, 'bumper_f')} onPointerOut={out} onClick={e => clk(e, 'bumper_f')}>
        <boxGeometry args={[1.75, 0.42, 0.38]} />
      </mesh>

      {/* Rear Diffuser Bumper */}
      <mesh position={[0, 0.42, -2.02]} material={createPanelMat('bumper_r')}
        onPointerOver={e => hov(e, 'bumper_r')} onPointerOut={out} onClick={e => clk(e, 'bumper_r')}>
        <boxGeometry args={[1.7, 0.45, 0.32]} />
      </mesh>

      {/* Big Rally GT Wing */}
      <group position={[0, 1.25, -1.7]}>
        <mesh material={createPanelMat('spoiler')}
          onPointerOver={e => hov(e, 'spoiler')} onPointerOut={out} onClick={e => clk(e, 'spoiler')}>
          <boxGeometry args={[1.7, 0.06, 0.35]} />
        </mesh>
        <mesh position={[-0.6, -0.22, 0]} material={carbonMat}><boxGeometry args={[0.06, 0.44, 0.15]} /></mesh>
        <mesh position={[0.6, -0.22, 0]} material={carbonMat}><boxGeometry args={[0.06, 0.44, 0.15]} /></mesh>
      </group>

      {/* Side Skirts */}
      <mesh position={[-0.86, 0.25, -0.1]} material={createPanelMat('skirt_l')}
        onPointerOver={e => hov(e, 'skirt_l')} onPointerOut={out} onClick={e => clk(e, 'skirt_l')}>
        <boxGeometry args={[0.09, 0.12, 1.85]} />
      </mesh>
      <mesh position={[0.86, 0.25, -0.1]} material={createPanelMat('skirt_r')}
        onPointerOver={e => hov(e, 'skirt_r')} onPointerOut={out} onClick={e => clk(e, 'skirt_r')}>
        <boxGeometry args={[0.09, 0.12, 1.85]} />
      </mesh>

      {/* Locked Turbo Engine Bay */}
      <group position={[0, 0.5, 1.05]} onPointerOver={e => hov(e, 'engine', true, 'Mesin Turbo 4G63')} onPointerOut={out} onClick={e => clk(e, 'engine', true, 'Mesin Turbo 4G63')}>
        <mesh material={engineMat}><boxGeometry args={[0.85, 0.32, 0.65]} /></mesh>
        <mesh position={[0.25, 0.18, 0.1]} material={chrome}><cylinderGeometry args={[0.1, 0.1, 0.18, 16]} /></mesh>
      </group>

      {/* Locked Glass / Windows */}
      <group onPointerOver={e => hov(e, 'glass', true, 'Kaca Lancer Evo')} onPointerOut={out} onClick={e => clk(e, 'glass', true, 'Kaca Lancer Evo')}>
        <mesh position={[0, 0.96, 0.55]} rotation={[-0.5, 0, 0]} material={glass}><boxGeometry args={[1.48, 0.05, 0.72]} /></mesh>
        <mesh position={[0, 1.0, -1.05]} rotation={[0.4, 0, 0]} material={glass}><boxGeometry args={[1.42, 0.05, 0.62]} /></mesh>
        <mesh position={[-0.82, 0.95, -0.25]} material={glass}><boxGeometry args={[0.04, 0.4, 1.35]} /></mesh>
        <mesh position={[0.82, 0.95, -0.25]} material={glass}><boxGeometry args={[0.04, 0.4, 1.35]} /></mesh>
      </group>

      {/* Lights & Intercooler */}
      <mesh position={[-0.58, 0.52, 1.98]} material={headlight}><boxGeometry args={[0.42, 0.12, 0.08]} /></mesh>
      <mesh position={[0.58, 0.52, 1.98]} material={headlight}><boxGeometry args={[0.42, 0.12, 0.08]} /></mesh>
      <mesh position={[0, 0.32, 2.0]} material={chrome}><boxGeometry args={[0.95, 0.22, 0.04]} /></mesh>
      <mesh position={[-0.58, 0.6, -2.15]} material={taillight}><boxGeometry args={[0.42, 0.1, 0.08]} /></mesh>
      <mesh position={[0.58, 0.6, -2.15]} material={taillight}><boxGeometry args={[0.42, 0.1, 0.08]} /></mesh>

      {/* Wheels */}
      {[[-0.88, 0.32, 1.3], [0.88, 0.32, 1.3], [-0.88, 0.32, -1.4], [0.88, 0.32, -1.4]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={tire}><cylinderGeometry args={[0.34, 0.34, 0.26, 32]} /></mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} material={chrome}><cylinderGeometry args={[0.23, 0.23, 0.27, 16]} /></mesh>
        </group>
      ))}
    </group>
  );
}
