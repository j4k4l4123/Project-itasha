import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { PAINT_FINISHES } from '../../utils/constants';

export function CoupeModel({
  bodyColor = '#ff007f', finishKey = 'GLOSS', selectedPanels = [], panelTextures = {},
  hoveredPart = null, onPanelClick, onPartHover
}) {
  const groupRef = useRef();
  const finish = PAINT_FINISHES[finishKey] || PAINT_FINISHES.GLOSS;

  const createPanelMaterial = (panelId) => {
    const isSelected = selectedPanels.includes(panelId);
    const isHovered = hoveredPart?.id === panelId;
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

  const isEngineHovered = hoveredPart?.id === 'engine';
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
  const carbonMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.5, metalness: 0.3 }), []);

  const hov = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPartHover?.({ id, isLocked, label }); };
  const out = (e) => { e.stopPropagation(); onPartHover?.(null); };
  const clk = (e, id, isLocked = false, label = '') => { e.stopPropagation(); onPanelClick?.(id, isLocked, label); };

  return (
    <group ref={groupRef}>
      {/* === WIDE-BODY COUPE PANELS === */}
      {/* Hood - long and low */}
      <mesh position={[0, 0.62, 0.95]} rotation={[-0.12, 0, 0]} material={createPanelMaterial('hood')}
        onPointerOver={e => hov(e, 'hood')} onPointerOut={out} onClick={e => clk(e, 'hood')}>
        <boxGeometry args={[1.7, 0.06, 1.3]} />
      </mesh>
      {/* Roof - low profile */}
      <mesh position={[0, 1.08, -0.3]} material={createPanelMaterial('roof')}
        onPointerOver={e => hov(e, 'roof')} onPointerOut={out} onClick={e => clk(e, 'roof')}>
        <boxGeometry args={[1.45, 0.06, 1.2]} />
      </mesh>
      {/* Door Left - wide coupe door */}
      <mesh position={[-0.92, 0.58, -0.15]} material={createPanelMaterial('door_l')}
        onPointerOver={e => hov(e, 'door_l')} onPointerOut={out} onClick={e => clk(e, 'door_l')}>
        <boxGeometry args={[0.07, 0.55, 1.4]} />
      </mesh>
      {/* Door Right */}
      <mesh position={[0.92, 0.58, -0.15]} material={createPanelMaterial('door_r')}
        onPointerOver={e => hov(e, 'door_r')} onPointerOut={out} onClick={e => clk(e, 'door_r')}>
        <boxGeometry args={[0.07, 0.55, 1.4]} />
      </mesh>
      {/* Wide Fender Left - pronounced flare */}
      <mesh position={[-0.95, 0.55, 1.05]} material={createPanelMaterial('fender_l')}
        onPointerOver={e => hov(e, 'fender_l')} onPointerOut={out} onClick={e => clk(e, 'fender_l')}>
        <boxGeometry args={[0.12, 0.5, 0.9]} />
      </mesh>
      {/* Wide Fender Right */}
      <mesh position={[0.95, 0.55, 1.05]} material={createPanelMaterial('fender_r')}
        onPointerOver={e => hov(e, 'fender_r')} onPointerOut={out} onClick={e => clk(e, 'fender_r')}>
        <boxGeometry args={[0.12, 0.5, 0.9]} />
      </mesh>
      {/* Front Splitter / Bumper */}
      <mesh position={[0, 0.3, 1.72]} material={createPanelMaterial('bumper_f')}
        onPointerOver={e => hov(e, 'bumper_f')} onPointerOut={out} onClick={e => clk(e, 'bumper_f')}>
        <boxGeometry args={[1.85, 0.35, 0.4]} />
      </mesh>
      {/* Rear Bumper / Diffuser */}
      <mesh position={[0, 0.38, -1.7]} material={createPanelMaterial('bumper_r')}
        onPointerOver={e => hov(e, 'bumper_r')} onPointerOut={out} onClick={e => clk(e, 'bumper_r')}>
        <boxGeometry args={[1.8, 0.45, 0.35]} />
      </mesh>
      {/* Big Rear Wing */}
      <group position={[0, 1.15, -1.55]}>
        <mesh material={createPanelMaterial('spoiler')}
          onPointerOver={e => hov(e, 'spoiler')} onPointerOut={out} onClick={e => clk(e, 'spoiler')}>
          <boxGeometry args={[1.75, 0.05, 0.35]} />
        </mesh>
        <mesh position={[-0.65, -0.2, 0]} material={carbonMat}><boxGeometry args={[0.06, 0.4, 0.15]} /></mesh>
        <mesh position={[0.65, -0.2, 0]} material={carbonMat}><boxGeometry args={[0.06, 0.4, 0.15]} /></mesh>
      </group>
      {/* Side Skirts */}
      <mesh position={[-0.92, 0.22, -0.1]} material={createPanelMaterial('skirt_l')}
        onPointerOver={e => hov(e, 'skirt_l')} onPointerOut={out} onClick={e => clk(e, 'skirt_l')}>
        <boxGeometry args={[0.1, 0.12, 1.5]} />
      </mesh>
      <mesh position={[0.92, 0.22, -0.1]} material={createPanelMaterial('skirt_r')}
        onPointerOver={e => hov(e, 'skirt_r')} onPointerOut={out} onClick={e => clk(e, 'skirt_r')}>
        <boxGeometry args={[0.1, 0.12, 1.5]} />
      </mesh>

      {/* === ENGINE (LOCKED) === */}
      <group position={[0, 0.45, 0.9]}
        onPointerOver={e => hov(e, 'engine', true, 'Mesin Coupe')} onPointerOut={out} onClick={e => clk(e, 'engine', true, 'Mesin Coupe')}>
        <mesh material={engineMat}><boxGeometry args={[0.85, 0.3, 0.65]} /></mesh>
        <mesh position={[-0.28, 0.18, 0.05]} material={chrome}><cylinderGeometry args={[0.1, 0.1, 0.18, 16]} /></mesh>
        <mesh position={[0.28, 0.18, 0.05]} material={chrome}><cylinderGeometry args={[0.1, 0.1, 0.18, 16]} /></mesh>
      </group>

      {/* === LOCKED GLASS (Kaca) === */}
      <group onPointerOver={e => hov(e, 'glass', true, 'Kaca Coupe')} onPointerOut={out} onClick={e => clk(e, 'glass', true, 'Kaca Coupe')}>
        <mesh position={[0, 0.85, 0.42]} rotation={[-0.55, 0, 0]} material={glass}>
          <boxGeometry args={[1.42, 0.04, 0.6]} />
        </mesh>
        <mesh position={[0, 0.92, -1.0]} rotation={[0.5, 0, 0]} material={glass}>
          <boxGeometry args={[1.38, 0.04, 0.55]} />
        </mesh>
        <mesh position={[-0.86, 0.88, -0.3]} rotation={[0, 0, 0.1]} material={glass}>
          <boxGeometry args={[0.04, 0.35, 0.95]} />
        </mesh>
        <mesh position={[0.86, 0.88, -0.3]} rotation={[0, 0, -0.1]} material={glass}>
          <boxGeometry args={[0.04, 0.35, 0.95]} />
        </mesh>
      </group>
      {/* Pop-up headlight housings */}
      <mesh position={[-0.6, 0.48, 1.9]} material={headlight}><boxGeometry args={[0.3, 0.1, 0.08]} /></mesh>
      <mesh position={[0.6, 0.48, 1.9]} material={headlight}><boxGeometry args={[0.3, 0.1, 0.08]} /></mesh>
      <mesh position={[-0.6, 0.55, -1.85]} material={taillight}><boxGeometry args={[0.35, 0.08, 0.08]} /></mesh>
      <mesh position={[0.6, 0.55, -1.85]} material={taillight}><boxGeometry args={[0.35, 0.08, 0.08]} /></mesh>
      {/* Dual exhaust */}
      <mesh position={[-0.35, 0.25, -1.88]} rotation={[Math.PI/2, 0, 0]} material={chrome}>
        <cylinderGeometry args={[0.06, 0.06, 0.15, 16]} />
      </mesh>
      <mesh position={[0.35, 0.25, -1.88]} rotation={[Math.PI/2, 0, 0]} material={chrome}>
        <cylinderGeometry args={[0.06, 0.06, 0.15, 16]} />
      </mesh>
      <mesh position={[0, 0.28, 1.92]} material={dark}><boxGeometry args={[0.85, 0.15, 0.04]} /></mesh>
      {/* Wheels - wider stance */}
      {[[-0.92,0.32,1.2],[0.92,0.32,1.2],[-0.92,0.32,-1.25],[0.92,0.32,-1.25]].map(([x,y,z],i)=>(
        <group key={i} position={[x,y,z]}>
          <mesh rotation={[0,0,Math.PI/2]} material={tire}><cylinderGeometry args={[0.34,0.34,0.28,32]}/></mesh>
          <mesh rotation={[0,0,Math.PI/2]} material={chrome}><cylinderGeometry args={[0.24,0.24,0.29,16]}/></mesh>
          <mesh material={taillight}><boxGeometry args={[0.07,0.14,0.1]}/></mesh>
        </group>
      ))}
    </group>
  );
}
