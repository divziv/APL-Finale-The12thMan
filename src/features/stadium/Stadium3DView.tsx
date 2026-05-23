import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useEngineStore } from '../../stores/useEngineStore';

// A simple glowing stand component to represent crowd density
function StadiumStand({ position, rotation, color, label }: { position: [number, number, number], rotation: [number, number, number], color: string, label: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Gentle pulsing effect for "live" feel
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      meshRef.current.scale.set(pulse, 1, pulse);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef}>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
      </mesh>
      <Html position={[0, 1.5, 0]} center className="pointer-events-none">
        <div className="bg-slate-900/80 px-2 py-1 rounded text-[8px] font-mono font-bold text-white border border-slate-700 whitespace-nowrap backdrop-blur-sm">
          {label}
        </div>
      </Html>
    </group>
  );
}

function Pitch() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[6, 8]} />
      <meshStandardMaterial color="#4ade80" roughness={0.8} />
      {/* Pitch center */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1, 3]} />
        <meshStandardMaterial color="#d4d4d8" />
      </mesh>
    </mesh>
  );
}

export default function Stadium3DView() {
  const matchEvent = useEngineStore(state => state.matchEvent);
  
  // Dynamic color based on events
  const getNorthColor = () => {
    if (matchEvent?.type === 'INNINGS_BREAK') return '#ef4444'; // Red/Congested
    if (matchEvent?.type === 'WICKET') return '#eab308'; // Yellow/Moderate
    return '#3b82f6'; // Blue/Optimal
  };

  return (
    <div className="w-full h-[400px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative shadow-2xl shadow-cyan-900/20">
      
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700">
          <h3 className="text-cyan-400 font-mono text-xs font-bold uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            3D Stadium Digital Twin
          </h3>
          <p className="text-[9px] text-slate-400 font-mono mt-0.5">Render Engine: Active | Telemetry: Live</p>
        </div>
      </div>

      <Canvas camera={{ position: [0, 8, 12], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, 5, -10]} intensity={2} color="#06b6d4" />
        
        <Pitch />
        
        {/* Surrounding stands forming a bowl */}
        <StadiumStand position={[0, 0, -4.5]} rotation={[0, 0, 0]} color={getNorthColor()} label="NORTH STAND" />
        <StadiumStand position={[0, 0, 4.5]} rotation={[0, Math.PI, 0]} color="#3b82f6" label="SOUTH PAVILION" />
        <StadiumStand position={[-4.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#10b981" label="WEST TERRACE" />
        <StadiumStand position={[4.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="#8b5cf6" label="EAST GALLERY" />

        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2.5} 
          minDistance={8} 
          maxDistance={20} 
          autoRotate 
          autoRotateSpeed={0.5} 
        />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
