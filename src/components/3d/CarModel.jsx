import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { PAINT_FINISHES, REAL_CAR_MODELS } from '../../utils/constants';

// Preload GLTF models for instant loading
useGLTF.preload('/models/ferrari.glb');
useGLTF.preload('/models/toycar.glb');
useGLTF.preload('/models/truck.glb');

/**
 * Real 3D Vehicle Model Component using authentic GLTF/GLB models (Ferrari 458 Italia GT, ToyCar, Truck)
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

  const modelInfo = REAL_CAR_MODELS.find((m) => m.id === modelId) || REAL_CAR_MODELS[0];
  const finish = PAINT_FINISHES[finishKey] || PAINT_FINISHES.GLOSS;

  // Load GLTF model dynamically
  const gltf = useGLTF(modelInfo.path);

  // Clone GLTF scene to ensure clean per-instance material assignment
  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    // Normalize scale and position
    clone.position.set(...modelInfo.position);
    clone.scale.setScalar(modelInfo.scale);

    return clone;
  }, [gltf.scene, modelInfo]);

  // Main composite texture map (merges active panel textures like hood/doors)
  const compositeTexture = useMemo(() => {
    // Pick active texture from hood, door_l, roof, etc.
    return panelTextures.hood || panelTextures.door_l || panelTextures.roof || panelTextures.door_r || null;
  }, [panelTextures]);

  // Base Paint Material for Real Car Body
  const carPaintMaterial = useMemo(() => {
    const isAnySelected = selectedPanels.length > 0;
    const isHovered = hoveredPart && !['engine'].includes(hoveredPart);

    return new THREE.MeshPhysicalMaterial({
      color: compositeTexture ? '#ffffff' : bodyColor,
      map: compositeTexture,
      roughness: finish.roughness,
      metalness: finish.metalness,
      clearcoat: finish.clearcoat,
      clearcoatRoughness: finish.clearcoatRoughness,
      emissive: isAnySelected ? '#00f3ff' : (isHovered ? '#39c5bb' : '#000000'),
      emissiveIntensity: isAnySelected ? 0.15 : (isHovered ? 0.1 : 0.0),
      envMapIntensity: 1.8,
      side: THREE.DoubleSide
    });
  }, [bodyColor, finish, selectedPanels, hoveredPart, compositeTexture]);

  // Locked Engine Material
  const isEngineHovered = hoveredPart === 'engine';
  const engineMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isEngineHovered ? '#ef4444' : '#2a2f3a',
      metalness: 0.9,
      roughness: 0.3,
      emissive: isEngineHovered ? '#dc2626' : '#000000',
      emissiveIntensity: isEngineHovered ? 0.5 : 0.0
    });
  }, [isEngineHovered]);

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
        const parentName = (child.parent?.name || '').toLowerCase();

        // 1. Engine / Mechanical parts (Locked)
        if (meshName.includes('metal') || meshName.includes('engine') || parentName.includes('engine')) {
          child.material = engineMaterial;
        }
        // 2. Glass / Windows
        else if (meshName.includes('glass') || meshName.includes('window')) {
          child.material = glassMaterial;
        }
        // 3. Carbon Fibre Trim
        else if (meshName.includes('carbon')) {
          child.material = carbonMaterial;
        }
        // 4. Chrome / Exhaust / Grill
        else if (meshName.includes('chrome') || meshName.includes('grills')) {
          child.material = chromeMaterial;
        }
        // 5. Main Car Body & Paintable Panels
        else if (meshName.includes('body') || meshName.includes('trim') || meshName.includes('toycar')) {
          child.material = carPaintMaterial;
        }
      }
    });
  }, [clonedScene, carPaintMaterial, engineMaterial, glassMaterial, carbonMaterial, chromeMaterial]);

  // Detect panel ID from click hit point on 3D vehicle
  const getPanelFromPoint = (point, meshName = '') => {
    if (!point) return 'hood';

    const { x, y, z } = point;

    // Engine bay region (mid-rear V8 engine on Ferrari)
    if (meshName.toLowerCase().includes('metal') || (z < -0.3 && z > -1.1 && y > 0.4 && y < 0.95 && Math.abs(x) < 0.45)) {
      return { id: 'engine', isEngine: true };
    }

    // Hood (Kap Mesin)
    if (z > 0.3 && y > 0.3 && Math.abs(x) < 0.65) return { id: 'hood', isEngine: false };
    // Roof (Atap)
    if (y > 0.95 && z < 0.3 && z > -0.65 && Math.abs(x) < 0.6) return { id: 'roof', isEngine: false };
    // Left Door
    if (x < -0.55 && z < 0.4 && z > -0.5) return { id: 'door_l', isEngine: false };
    // Right Door
    if (x > 0.55 && z < 0.4 && z > -0.5) return { id: 'door_r', isEngine: false };
    // Front Bumper
    if (z > 1.25) return { id: 'bumper_f', isEngine: false };
    // Rear Bumper
    if (z < -1.35) return { id: 'bumper_r', isEngine: false };
    // Spoiler
    if (z < -1.1 && y > 0.85) return { id: 'spoiler', isEngine: false };
    // Left Fender
    if (x < -0.55 && z > 0.4) return { id: 'fender_l', isEngine: false };
    // Right Fender
    if (x > 0.55 && z > 0.4) return { id: 'fender_r', isEngine: false };

    // Default to selected panel or hood
    return { id: selectedPanels[0] || 'hood', isEngine: false };
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const meshName = e.object?.name || '';
    const panel = getPanelFromPoint(e.point, meshName);
    onPartHover?.(panel);
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    onPartHover?.(null);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const meshName = e.object?.name || '';
    const panel = getPanelFromPoint(e.point, meshName);
    onPanelClick?.(panel.id, panel.isEngine);
  };

  // Interactive 3D panel hotspots for easy targeted clicking
  const panelHotspots = [
    { id: 'hood', pos: [0, 0.75, 0.9], label: 'Kap Mesin' },
    { id: 'roof', pos: [0, 1.35, -0.3], label: 'Atap' },
    { id: 'door_l', pos: [-0.9, 0.65, -0.15], label: 'Pintu Kiri' },
    { id: 'door_r', pos: [0.9, 0.65, -0.15], label: 'Pintu Kanan' },
    { id: 'bumper_f', pos: [0, 0.4, 1.75], label: 'Bumper Depan' },
    { id: 'bumper_r', pos: [0, 0.5, -1.8], label: 'Bumper Belakang' },
    { id: 'spoiler', pos: [0, 1.25, -1.65], label: 'Spoiler' },
    { id: 'engine', pos: [0, 0.6, -0.6], label: '🔒 Mesin V8 (Locked)', isEngine: true }
  ];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Real 3D Vehicle GLTF Mesh Model */}
      <primitive
        object={clonedScene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* 3D Interactive Hotspot Markers for precise panel targeting */}
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
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color={spot.isEngine ? '#ef4444' : (isSelected ? '#00f3ff' : (isHovered ? '#39c5bb' : '#ffffff'))}
              emissive={spot.isEngine ? '#dc2626' : (isSelected ? '#00f3ff' : (isHovered ? '#39c5bb' : '#222222'))}
              emissiveIntensity={isSelected ? 1.5 : (isHovered ? 1.0 : 0.3)}
              transparent
              opacity={isSelected || isHovered || spot.isEngine ? 0.9 : 0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}
