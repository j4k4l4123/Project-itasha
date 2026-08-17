import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Html } from '@react-three/drei';
import { VEHICLE_TYPES } from '../../utils/constants';
import { CarModel } from './CarModel';
import { MotorcycleModel } from './MotorcycleModel';

function CameraHelper({ isTurntable, turntableSpeed }) {
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isTurntable;
      controlsRef.current.autoRotateSpeed = turntableSpeed || 2.5;
    }
  }, [isTurntable, turntableSpeed]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minDistance={1.8}
      maxDistance={9.0}
      maxPolarAngle={Math.PI / 2 + 0.05}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      dampingFactor={0.05}
    />
  );
}

function LoadingSpinner() {
  return (
    <Html center>
      <div style={{
        background: 'rgba(10, 12, 16, 0.9)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 243, 255, 0.5)',
        borderRadius: '16px',
        padding: '18px 32px',
        color: '#00f3ff',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 0 35px rgba(0, 243, 255, 0.35)',
        whiteSpace: 'nowrap'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '3px solid #00f3ff',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '14px', letterSpacing: '0.5px' }}>Memuat Model 3D Kendaraan & Livery Map...</span>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Html>
  );
}

export function VehicleViewer({
  vehicleType = VEHICLE_TYPES.CAR,
  modelId = 'ferrari',
  bodyColor = '#39c5bb',
  finishKey = 'GLOSS',
  selectedPanels = [],
  panelTextures = {},
  hoveredPart = null,
  isTurntable = false,
  onPanelClick,
  onPartHover,
  canvasRef
}) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        ref={canvasRef}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [3.6, 2.2, 4.4], fov: 45 }}
        shadows
      >
        <color attach="background" args={['#0a0c10']} />

        {/* Studio Lighting */}
        <ambientLight intensity={0.75} />
        <directionalLight position={[10, 15, 10]} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} />
        <directionalLight position={[-10, 10, -10]} intensity={0.9} />
        <spotLight position={[0, 10, 0]} intensity={1.6} angle={0.6} penumbra={0.8} color="#00f3ff" />
        <spotLight position={[-5, 5, 5]} intensity={1.0} angle={0.5} penumbra={0.5} color="#ff007f" />

        {/* Studio Environment Map */}
        <Environment preset="city" />

        {/* 3D Vehicle Render with Suspense */}
        <Suspense fallback={<LoadingSpinner />}>
          <group position={[0, -0.15, 0]}>
            {vehicleType === VEHICLE_TYPES.CAR ? (
              <CarModel
                modelId={modelId}
                bodyColor={bodyColor}
                finishKey={finishKey}
                selectedPanels={selectedPanels}
                panelTextures={panelTextures}
                hoveredPart={hoveredPart}
                onPanelClick={onPanelClick}
                onPartHover={onPartHover}
              />
            ) : (
              <MotorcycleModel
                modelId={modelId}
                bodyColor={bodyColor}
                finishKey={finishKey}
                selectedPanels={selectedPanels}
                panelTextures={panelTextures}
                hoveredPart={hoveredPart}
                onPanelClick={onPanelClick}
                onPartHover={onPartHover}
              />
            )}

            {/* Ground Contact Shadows */}
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.85}
              scale={12}
              blur={2.5}
              far={4.5}
            />
          </group>
        </Suspense>

        {/* Orbit Controls with 360 Turntable */}
        <CameraHelper isTurntable={isTurntable} turntableSpeed={2.8} />
      </Canvas>

      {/* Floating Locked Component Notification (Kaca, Spion, Jok, Mesin) */}
      {(hoveredPart?.isLocked || hoveredPart?.isEngine) && (
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 10,
            background: 'rgba(20, 10, 15, 0.85)',
            border: '1px solid #ef4444',
            borderRadius: '999px',
            padding: '8px 20px',
            color: '#f87171',
            fontWeight: '600',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.45)',
            backdropFilter: 'blur(12px)'
          }}
          className="badge-locked glow-pulse-cyan"
        >
          🔒 KOMPONEN TERKUNCI — {hoveredPart?.label || (hoveredPart?.id === 'glass' ? 'Kaca & Visor' : (hoveredPart?.id === 'mirror' ? 'Spion' : (hoveredPart?.id === 'seat' ? 'Jok Motor' : 'Mesin / Mekanikal')))} (Tidak Dapat Dimodifikasi)
        </div>
      )}
    </div>
  );
}
