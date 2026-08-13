import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { PAINT_FINISHES } from '../../utils/constants';

// Preload real 3D motorcycle model
useGLTF.preload('/models/motorcycle.glb');

/**
 * Real 3D Motorcycle Model Component using authentic GLTF/GLB model (models/motorcycle.glb)
 */
export function MotorcycleModel({
  bodyColor = '#ff007f',
  finishKey = 'GLOSS',
  selectedPanels = [],
  panelTextures = {},
  hoveredPart = null,
  onPanelClick,
  onPartHover
}) {
  const groupRef = useRef();
  const finish = PAINT_FINISHES[finishKey] || PAINT_FINISHES.GLOSS;

  // Load real GLTF motorcycle model
  const gltf = useGLTF('/models/motorcycle.glb');

  // Clone GLTF scene to ensure clean per-instance material assignment
  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    // Center and scale the motorcycle model appropriately
    clone.position.set(0, 0, 0);
    clone.scale.setScalar(1.0);

    return clone;
  }, [gltf.scene]);

  // Main composite texture map for motorcycle panels
  const compositeTexture = useMemo(() => {
    return panelTextures.tank || panelTextures.fairing_l || panelTextures.fairing_r || panelTextures.fairing_f || panelTextures.tail || null;
  }, [panelTextures]);

  // Base Paint Material for Real Motorcycle Body
  const motorcyclePaintMaterial = useMemo(() => {
    const isAnySelected = selectedPanels.length > 0;
    const isHovered = hoveredPart && !['engine'].includes(hoveredPart);

    return new THREE.MeshPhysicalMaterial({
      color: compositeTexture ? '#ffffff' : bodyColor,
      map: compositeTexture,
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

  // Locked V4 Engine Material
  const isEngineHovered = hoveredPart === 'engine';
  const engineMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isEngineHovered ? '#ef4444' : '#27272a',
      metalness: 0.9,
      roughness: 0.3,
      emissive: isEngineHovered ? '#dc2626' : '#000000',
      emissiveIntensity: isEngineHovered ? 0.5 : 0.0
    });
  }, [isEngineHovered]);

  // Apply materials to cloned motorcycle mesh
  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.material = motorcyclePaintMaterial;
      }
    });
  }, [clonedScene, motorcyclePaintMaterial]);

  // Detect panel ID from click hit point on 3D motorcycle
  const getPanelFromPoint = (point) => {
    if (!point) return 'tank';

    const { x, y, z } = point;

    // Engine bay region (center bottom of bike)
    if (y < 0.6 && y > 0.2 && Math.abs(z) < 0.4 && Math.abs(x) < 0.3) {
      return { id: 'engine', isEngine: true };
    }

    // Fuel Tank (Tangki Bensin)
    if (y > 0.8 && z > -0.2 && z < 0.45 && Math.abs(x) < 0.4) return { id: 'tank', isEngine: false };
    // Front Fairing (Nose)
    if (z > 0.5 && y > 0.8) return { id: 'fairing_f', isEngine: false };
    // Left Side Fairing
    if (x < -0.25 && z > 0.1 && z < 0.7) return { id: 'fairing_l', isEngine: false };
    // Right Side Fairing
    if (x > 0.25 && z > 0.1 && z < 0.7) return { id: 'fairing_r', isEngine: false };
    // Tail Cowl
    if (z < -0.4 && y > 0.7) return { id: 'tail', isEngine: false };
    // Front Fender / Spakbor
    if (z > 0.8 && y < 0.6) return { id: 'fender_f', isEngine: false };

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

  // Interactive 3D panel hotspots for easy targeted clicking on real motorcycle
  const panelHotspots = [
    { id: 'tank', pos: [0, 0.95, 0.1], label: 'Tangki Bensin' },
    { id: 'fairing_f', pos: [0, 1.05, 0.85], label: 'Fairing Depan' },
    { id: 'fairing_l', pos: [-0.35, 0.7, 0.45], label: 'Fairing Kiri' },
    { id: 'fairing_r', pos: [0.35, 0.7, 0.45], label: 'Fairing Kanan' },
    { id: 'tail', pos: [0, 1.05, -0.75], label: 'Buntut / Tail Cowl' },
    { id: 'fender_f', pos: [0, 0.55, 1.15], label: 'Spakbor Depan' },
    { id: 'engine', pos: [0, 0.5, 0.05], label: '🔒 Mesin V4 (Locked)', isEngine: true }
  ];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Real 3D Motorcycle GLTF Model */}
      <primitive
        object={clonedScene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* 3D Interactive Hotspot Markers */}
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
              opacity={isSelected || isHovered || spot.isEngine ? 0.9 : 0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}
