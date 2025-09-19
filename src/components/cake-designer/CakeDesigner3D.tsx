'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface CakeLayer {
  id: string;
  shape: 'round' | 'square' | 'heart';
  size: number;
  height: number;
  flavor: string;
  color: string;
  texture?: string;
}

interface CakeDesign {
  layers: CakeLayer[];
  decorations: Array<{
    id: string;
    type: 'flower' | 'text' | 'candle' | 'fruit';
    position: [number, number, number];
    color: string;
    content?: string;
  }>;
  frosting: {
    type: 'smooth' | 'textured' | 'piped';
    color: string;
  };
}

interface CakeLayer3DProps {
  layer: CakeLayer;
  yPosition: number;
}

function CakeLayer3D({ layer, yPosition }: CakeLayer3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create geometry based on shape
  const geometry = (() => {
    switch (layer.shape) {
      case 'round':
        return new THREE.CylinderGeometry(layer.size, layer.size, layer.height, 32);
      case 'square':
        return new THREE.BoxGeometry(layer.size * 2, layer.height, layer.size * 2);
      case 'heart':
        // Simplified heart shape using cylinder for demo
        return new THREE.CylinderGeometry(layer.size, layer.size * 0.8, layer.height, 8);
      default:
        return new THREE.CylinderGeometry(layer.size, layer.size, layer.height, 32);
    }
  })();

  // Create material with cake-like appearance
  const material = new THREE.MeshStandardMaterial({
    color: layer.color,
    roughness: 0.8,
    metalness: 0.1,
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, yPosition, 0]}
      castShadow
      receiveShadow
    >
      {/* Add frosting layer */}
      <mesh position={[0, layer.height / 2 + 0.05, 0]}>
        <cylinderGeometry args={[layer.size + 0.1, layer.size + 0.1, 0.1, 32]} />
        <meshStandardMaterial color="#f8f8ff" roughness={0.6} />
      </mesh>
    </mesh>
  );
}

interface Decoration3DProps {
  decoration: {
    id: string;
    type: 'flower' | 'text' | 'candle' | 'fruit';
    position: [number, number, number];
    color: string;
    content?: string;
  };
}

function Decoration3D({ decoration }: Decoration3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const getDecorationGeometry = () => {
    switch (decoration.type) {
      case 'flower':
        return <sphereGeometry args={[0.1, 8, 8]} />;
      case 'candle':
        return <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />;
      case 'fruit':
        return <sphereGeometry args={[0.08, 8, 8]} />;
      default:
        return <boxGeometry args={[0.1, 0.1, 0.1]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={decoration.position}
      castShadow
    >
      {getDecorationGeometry()}
      <meshStandardMaterial color={decoration.color} />
      {decoration.type === 'text' && decoration.content && (
        <Text
          position={[0, 0.1, 0]}
          fontSize={0.1}
          color={decoration.color}
          anchorX="center"
          anchorY="middle"
        >
          {decoration.content}
        </Text>
      )}
    </mesh>
  );
}

interface Scene3DProps {
  design: CakeDesign;
}

function Scene3D({ design }: Scene3DProps) {
  // Calculate layer positions
  let currentY = 0;
  const layerPositions = design.layers.map((layer) => {
    const y = currentY + layer.height / 2;
    currentY += layer.height;
    return y;
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[5, 5, 5]} intensity={0.5} />

      {/* Cake Base/Platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3, 0.2, 32]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>

      {/* Cake Layers */}
      {design.layers.map((layer, index) => (
        <CakeLayer3D
          key={layer.id}
          layer={layer}
          yPosition={layerPositions[index]}
        />
      ))}

      {/* Decorations */}
      {design.decorations.map((decoration) => (
        <Decoration3D key={decoration.id} decoration={decoration} />
      ))}

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

interface CakeDesigner3DProps {
  design: CakeDesign;
  className?: string;
}

export function CakeDesigner3D({ design, className }: CakeDesigner3DProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading 3D Preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 8], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB, #f0f8ff)' }}
      >
        <Suspense fallback={null}>
          <Scene3D design={design} />
        </Suspense>
      </Canvas>

      {/* Control Instructions */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded text-xs">
        <p>🖱️ Drag to rotate</p>
        <p>🔍 Scroll to zoom</p>
        <p>⌨️ Right-click + drag to pan</p>
      </div>
    </div>
  );
}