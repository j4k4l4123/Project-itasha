import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { PAINT_FINISHES } from '../../utils/constants';

export function CruiserModel({
  bodyColor = '#dc2626', finishKey = 'GLOSS', selectedPanels = [], panelTextures = {},
  hoveredPart = null, onPanelClick, onPartHover
}) {
  const groupRef = useRef();
  const finish = PAINT_FINISHES[finishKey] || PAINT_FINISHES.GLOSS;

  const createPanelMaterial = (panelId) => {
    const isSelected = selectedPanels.includes(panelId);
    const isHovered = hoveredPart === panelId;
    const texture = panelTextures[panelId] || null;
    return new THREE.MeshPhysicalMaterial({
      color: texture ? '#ffffff' : bodyColor, map: texture,
      roughness: finish.roughness, metalness: finish.metalness,
      clearcoat: finish.clearcoat, clearcoatRoughness: finish.clearcoatRoughness,
      emissive: isSelected ? '#00f3ff' : (isHovered ? '#ff007f' : '#000000'),
      emissiveIntensity: isSelected ? 0.35 : (isHovered ? 0.2 : 0.0),
      envMapIntensity: 1.5, side: THREE.DoubleSide
    });
  };

  const isEngineHovered = hoveredPart === 'engine';
  const engineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#27272a', metalness: 0.9, roughness: 0.25,
    emissive: isEngineHovered ? '#dc2626' : '#000', emissiveIntensity: isEngineHovered ? 0.4 : 0
  }), [isEngineHovered]);
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1f5f9', metalness: 0.95, roughness: 0.08 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.8 }), []);
  const tire = useMemo(() => new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.95 }), []);
  const headlight = useMemo(() => new THREE.MeshStandardMaterial({ color: '#fffbe6', emissive: '#fffbe6', emissiveIntensity: 2 }), []);
  const taillight = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ff0033', emissive: '#ff0033', emissiveIntensity: 2 }), []);
  const seat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3b1f0a', roughness: 0.95 }), []);

  const hov = (e, id, eng = false) => { e.stopPropagation(); onPartHover?.({ id, isEngine: eng }); };
  const out = (e) => { e.stopPropagation(); onPartHover?.(null); };
  const clk = (e, id, eng = false) => { e.stopPropagation(); onPanelClick?.(id, eng); };

  return (
    <group ref={groupRef}>
      {/* Teardrop Fuel Tank */}
      <mesh position={[0, 0.88, 0.15]} rotation={[-0.12, 0, 0]} material={createPanelMaterial('tank')}
        onPointerOver={e => hov(e, 'tank')} onPointerOut={out} onClick={e => clk(e, 'tank')}>
        <boxGeometry args={[0.55, 0.4, 0.7]} />
      </mesh>
      {/* Front Fender - long cruiser style */}
      <mesh position={[0, 0.42, 1.2]} rotation={[-0.15, 0, 0]} material={createPanelMaterial('fender_f')}
        onPointerOver={e => hov(e, 'fender_f')} onPointerOut={out} onClick={e => clk(e, 'fender_f')}>
        <boxGeometry args={[0.35, 0.08, 0.75]} />
      </mesh>
      {/* Rear Fender - wide and long */}
      <mesh position={[0, 0.4, -0.8]} material={createPanelMaterial('tail')}
        onPointerOver={e => hov(e, 'tail')} onPointerOut={out} onClick={e => clk(e, 'tail')}>
        <boxGeometry args={[0.45, 0.1, 0.8]} />
      </mesh>
      {/* Left Saddlebag */}
      <mesh position={[-0.35, 0.5, -0.7]} material={createPanelMaterial('fairing_l')}
        onPointerOver={e => hov(e, 'fairing_l')} onPointerOut={out} onClick={e => clk(e, 'fairing_l')}>
        <boxGeometry args={[0.2, 0.3, 0.45]} />
      </mesh>
      {/* Right Saddlebag */}
      <mesh position={[0.35, 0.5, -0.7]} material={createPanelMaterial('fairing_r')}
        onPointerOver={e => hov(e, 'fairing_r')} onPointerOut={out} onClick={e => clk(e, 'fairing_r')}>
        <boxGeometry args={[0.2, 0.3, 0.45]} />
      </mesh>

      {/* V-Twin Engine (LOCKED) */}
      <group position={[0, 0.52, 0.0]}
        onPointerOver={e => hov(e, 'engine', true)} onPointerOut={out} onClick={e => clk(e, 'engine', true)}>
        <mesh material={engineMat}><boxGeometry args={[0.45, 0.38, 0.5]} /></mesh>
        {/* V-Twin cylinders */}
        <mesh position={[0, 0.22, 0.12]} rotation={[0.4, 0, 0]} material={chrome}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 12]} />
        </mesh>
        <mesh position={[0, 0.22, -0.12]} rotation={[-0.4, 0, 0]} material={chrome}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 12]} />
        </mesh>
        {/* Chrome exhaust pipes */}
        <mesh position={[0.22, -0.1, -0.15]} rotation={[0.3, 0, 0.2]} material={chrome}>
          <cylinderGeometry args={[0.04, 0.05, 1.2, 12]} />
        </mesh>
        <mesh position={[-0.22, -0.1, -0.15]} rotation={[0.3, 0, -0.2]} material={chrome}>
          <cylinderGeometry args={[0.04, 0.05, 1.2, 12]} />
        </mesh>
      </group>

      {/* Frame */}
      <mesh position={[0, 0.7, 0.05]} material={chrome}><boxGeometry args={[0.18, 0.12, 1.1]} /></mesh>
      {/* Stepped Seat */}
      <mesh position={[0, 0.82, -0.35]} rotation={[-0.05, 0, 0]} material={seat}>
        <boxGeometry args={[0.35, 0.1, 0.55]} />
      </mesh>
      <mesh position={[0, 0.78, -0.7]} material={seat}>
        <boxGeometry args={[0.38, 0.1, 0.35]} />
      </mesh>
      {/* High Handlebars */}
      <group position={[0, 1.05, 0.6]}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={chrome}>
          <cylinderGeometry args={[0.025, 0.025, 0.75, 12]} />
        </mesh>
      </group>
      {/* Round Headlight */}
      <mesh position={[0, 0.9, 1.15]} material={headlight}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
      {/* Taillight */}
      <mesh position={[0, 0.52, -1.15]} material={taillight}>
        <boxGeometry args={[0.15, 0.06, 0.04]} />
      </mesh>
      {/* Raked Front Forks */}
      <group position={[0, 0.6, 0.9]} rotation={[-0.45, 0, 0]}>
        <mesh position={[-0.18, 0, 0]} material={chrome}><cylinderGeometry args={[0.035, 0.035, 0.9, 12]} /></mesh>
        <mesh position={[0.18, 0, 0]} material={chrome}><cylinderGeometry args={[0.035, 0.035, 0.9, 12]} /></mesh>
      </group>
      {/* Fat Front Wheel */}
      <group position={[0, 0.38, 1.25]}>
        <mesh rotation={[0, 0, Math.PI/2]} material={tire}><cylinderGeometry args={[0.38, 0.38, 0.18, 32]} /></mesh>
        <mesh rotation={[0, 0, Math.PI/2]} material={chrome}><cylinderGeometry args={[0.25, 0.25, 0.19, 16]} /></mesh>
      </group>
      {/* Fat Rear Wheel */}
      <group position={[0, 0.38, -1.0]}>
        <mesh rotation={[0, 0, Math.PI/2]} material={tire}><cylinderGeometry args={[0.4, 0.4, 0.25, 32]} /></mesh>
        <mesh rotation={[0, 0, Math.PI/2]} material={chrome}><cylinderGeometry args={[0.26, 0.26, 0.26, 16]} /></mesh>
      </group>
    </group>
  );
}
