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
      minDistance={2.0}
      maxDistance={8.0}
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
        background: 'rgba(10, 12, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 243, 255, 0.4)',
        borderRadius: '12px',
        padding: '16px 28px',
        color: '#00f3ff',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 0 25px rgba(0, 243, 255, 0.3)',
        whiteSpace: 'nowrap'
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          border: '3px solid #00f3ff',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span>Memuat Model 3D Kendaraan...</span>
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
        camera={{ position: [3.5, 2.2, 4.2], fov: 45 }}
        shadows
      >
        <color attach="background" args={['#0a0c10']} />

        {/* Studio Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} />
        <directionalLight position={[-10, 10, -10]} intensity={0.8} />
        <spotLight position={[0, 10, 0]} intensity={1.5} angle={0.6} penumbra={0.8} color="#00f3ff" />

        {/* Studio Environment map */}
        <Environment preset="city" />

        {/* 3D Vehicle Render with Suspense */}
        <Suspense fallback={<LoadingSpinner />}>
          <group position={[0, -0.2, 0]}>
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
              opacity={0.8}
              scale={10}
              blur={2.5}
              far={4}
            />
          </group>
        </Suspense>

        {/* Orbit Controls */}
        <CameraHelper isTurntable={isTurntable} turntableSpeed={3.0} />
      </Canvas>

      {/* Floating Locked Engine Notification */}
      {hoveredPart?.isEngine && (
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 10
          }}
          className="badge-locked glow-pulse-cyan"
        >
          🔒 MESIN TERKUNCI — Tidak Dapat Diedit / Locked Part
        </div>
      )}
    </div>
  );
}
