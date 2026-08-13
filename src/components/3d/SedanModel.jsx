import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { PAINT_FINISHES } from '../../utils/constants';

export function SedanModel({
  bodyColor = '#39c5bb', finishKey = 'GLOSS', selectedPanels = [], panelTextures = {},
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
      emissive: isSelected ? '#00f3ff' : (isHovered ? '#39c5bb' : '#000000'),
      emissiveIntensity: isSelected ? 0.35 : (isHovered ? 0.2 : 0.0),
      envMapIntensity: 1.5, side: THREE.DoubleSide
    });
  };

  const isEngineHovered = hoveredPart === 'engine';
  const engineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isEngineHovered ? '#ef4444' : '#2a2f3a', metalness: 0.9, roughness: 0.3,
    emissive: isEngineHovered ? '#dc2626' : '#000000', emissiveIntensity: isEngineHovered ? 0.4 : 0
  }), [isEngineHovered]);
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e2e8f0', metalness: 0.95, roughness: 0.1 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.8 }), []);
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#000', transmission: 0.9, opacity: 0.4, transparent: true, roughness: 0.05, ior: 1.5 }), []);
  const headlight = useMemo(() => new THREE.MeshStandardMaterial({ color: '#00f3ff', emissive: '#00f3ff', emissiveIntensity: 2 }), []);
  const taillight = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ff0055', emissive: '#ff0055', emissiveIntensity: 2.5 }), []);
  const tire = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.9 }), []);

  const hov = (e, id, eng = false) => { e.stopPropagation(); onPartHover?.({ id, isEngine: eng }); };
  const out = (e) => { e.stopPropagation(); onPartHover?.(null); };
  const clk = (e, id, eng = false) => { e.stopPropagation(); onPanelClick?.(id, eng); };

  return (
    <group ref={groupRef}>
      {/* === BODY PANELS === */}
      {/* Hood */}
      <mesh position={[0, 0.72, 1.1]} rotation={[-0.08, 0, 0]} material={createPanelMaterial('hood')}
        onPointerOver={e => hov(e, 'hood')} onPointerOut={out} onClick={e => clk(e, 'hood')}>
        <boxGeometry args={[1.6, 0.07, 1.2]} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.22, -0.2]} material={createPanelMaterial('roof')}
        onPointerOver={e => hov(e, 'roof')} onPointerOut={out} onClick={e => clk(e, 'roof')}>
        <boxGeometry args={[1.5, 0.07, 1.6]} />
      </mesh>
      {/* Trunk */}
      <mesh position={[0, 0.82, -1.55]} rotation={[0.05, 0, 0]} material={createPanelMaterial('spoiler')}
        onPointerOver={e => hov(e, 'spoiler')} onPointerOut={out} onClick={e => clk(e, 'spoiler')}>
        <boxGeometry args={[1.5, 0.07, 0.9]} />
      </mesh>
      {/* Door Left */}
      <mesh position={[-0.85, 0.65, -0.1]} material={createPanelMaterial('door_l')}
        onPointerOver={e => hov(e, 'door_l')} onPointerOut={out} onClick={e => clk(e, 'door_l')}>
        <boxGeometry args={[0.07, 0.6, 1.6]} />
      </mesh>
      {/* Door Right */}
      <mesh position={[0.85, 0.65, -0.1]} material={createPanelMaterial('door_r')}
        onPointerOver={e => hov(e, 'door_r')} onPointerOut={out} onClick={e => clk(e, 'door_r')}>
        <boxGeometry args={[0.07, 0.6, 1.6]} />
      </mesh>
      {/* Fender Left */}
      <mesh position={[-0.85, 0.6, 1.1]} material={createPanelMaterial('fender_l')}
        onPointerOver={e => hov(e, 'fender_l')} onPointerOut={out} onClick={e => clk(e, 'fender_l')}>
        <boxGeometry args={[0.08, 0.55, 1.0]} />
      </mesh>
      {/* Fender Right */}
      <mesh position={[0.85, 0.6, 1.1]} material={createPanelMaterial('fender_r')}
        onPointerOver={e => hov(e, 'fender_r')} onPointerOut={out} onClick={e => clk(e, 'fender_r')}>
        <boxGeometry args={[0.08, 0.55, 1.0]} />
      </mesh>
      {/* Bumper Front */}
      <mesh position={[0, 0.38, 1.8]} material={createPanelMaterial('bumper_f')}
        onPointerOver={e => hov(e, 'bumper_f')} onPointerOut={out} onClick={e => clk(e, 'bumper_f')}>
        <boxGeometry args={[1.7, 0.42, 0.35]} />
      </mesh>
      {/* Bumper Rear */}
      <mesh position={[0, 0.42, -2.0]} material={createPanelMaterial('bumper_r')}
        onPointerOver={e => hov(e, 'bumper_r')} onPointerOut={out} onClick={e => clk(e, 'bumper_r')}>
        <boxGeometry args={[1.65, 0.45, 0.3]} />
      </mesh>
      {/* Side Skirt L */}
      <mesh position={[-0.85, 0.25, -0.1]} material={createPanelMaterial('skirt_l')}
        onPointerOver={e => hov(e, 'skirt_l')} onPointerOut={out} onClick={e => clk(e, 'skirt_l')}>
        <boxGeometry args={[0.08, 0.12, 1.8]} />
      </mesh>
      {/* Side Skirt R */}
      <mesh position={[0.85, 0.25, -0.1]} material={createPanelMaterial('skirt_r')}
        onPointerOver={e => hov(e, 'skirt_r')} onPointerOut={out} onClick={e => clk(e, 'skirt_r')}>
        <boxGeometry args={[0.08, 0.12, 1.8]} />
      </mesh>

      {/* === ENGINE (LOCKED) === */}
      <group position={[0, 0.5, 1.0]}
        onPointerOver={e => hov(e, 'engine', true)} onPointerOut={out} onClick={e => clk(e, 'engine', true)}>
        <mesh material={engineMat}><boxGeometry args={[0.8, 0.3, 0.6]} /></mesh>
      </group>

      {/* === NON-EDITABLE === */}
      {/* Windshield */}
      <mesh position={[0, 0.95, 0.55]} rotation={[-0.5, 0, 0]} material={glass}>
        <boxGeometry args={[1.45, 0.05, 0.7]} />
      </mesh>
      {/* Rear Window */}
      <mesh position={[0, 1.0, -1.05]} rotation={[0.4, 0, 0]} material={glass}>
        <boxGeometry args={[1.4, 0.05, 0.6]} />
      </mesh>
      {/* Side Windows */}
      <mesh position={[-0.8, 0.95, -0.25]} rotation={[0, 0, 0.08]} material={glass}>
        <boxGeometry args={[0.04, 0.4, 1.3]} />
      </mesh>
      <mesh position={[0.8, 0.95, -0.25]} rotation={[0, 0, -0.08]} material={glass}>
        <boxGeometry args={[0.04, 0.4, 1.3]} />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.55, 0.52, 1.95]} material={headlight}><boxGeometry args={[0.4, 0.1, 0.08]} /></mesh>
      <mesh position={[0.55, 0.52, 1.95]} material={headlight}><boxGeometry args={[0.4, 0.1, 0.08]} /></mesh>
      {/* Taillights */}
      <mesh position={[-0.55, 0.6, -2.12]} material={taillight}><boxGeometry args={[0.4, 0.1, 0.08]} /></mesh>
      <mesh position={[0.55, 0.6, -2.12]} material={taillight}><boxGeometry args={[0.4, 0.1, 0.08]} /></mesh>
      {/* Grille */}
      <mesh position={[0, 0.35, 1.96]} material={dark}><boxGeometry args={[0.9, 0.18, 0.04]} /></mesh>
      {/* Wheels */}
      {[[-0.85,0.32,1.3],[0.85,0.32,1.3],[-0.85,0.32,-1.4],[0.85,0.32,-1.4]].map(([x,y,z],i)=>(
        <group key={i} position={[x,y,z]}>
          <mesh rotation={[0,0,Math.PI/2]} material={tire}><cylinderGeometry args={[0.32,0.32,0.24,32]}/></mesh>
          <mesh rotation={[0,0,Math.PI/2]} material={chrome}><cylinderGeometry args={[0.22,0.22,0.25,16]}/></mesh>
        </group>
      ))}
    </group>
  );
}
