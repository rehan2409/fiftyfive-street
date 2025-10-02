import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface Product3DViewerProps {
  category: string;
  color?: string;
  productImage?: string;
}

const TShirtModel = ({ color = "#ffffff", texture }: { color?: string; texture?: THREE.Texture | null }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  const material = texture 
    ? <meshStandardMaterial map={texture} roughness={0.7} metalness={0.1} />
    : <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />;

  return (
    <group ref={meshRef}>
      {/* T-Shirt Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 2, 0.3]} />
        {material}
      </mesh>
      
      {/* Left Sleeve */}
      <mesh position={[-1.2, 0.5, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.8, 0.4, 0.3]} />
        {material}
      </mesh>
      
      {/* Right Sleeve */}
      <mesh position={[1.2, 0.5, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.8, 0.4, 0.3]} />
        {material}
      </mesh>
      
      {/* Collar */}
      <mesh position={[0, 1.1, 0.1]}>
        <boxGeometry args={[0.6, 0.2, 0.2]} />
        {material}
      </mesh>
    </group>
  );
};

const JacketModel = ({ color = "#1a1a1a", texture }: { color?: string; texture?: THREE.Texture | null }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  const material = texture 
    ? <meshStandardMaterial map={texture} roughness={0.5} metalness={0.2} />
    : <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />;

  return (
    <group ref={meshRef}>
      {/* Jacket Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2.2, 0.4]} />
        {material}
      </mesh>
      
      {/* Left Sleeve */}
      <mesh position={[-1.3, 0.3, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[1, 0.5, 0.4]} />
        {material}
      </mesh>
      
      {/* Right Sleeve */}
      <mesh position={[1.3, 0.3, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[1, 0.5, 0.4]} />
        {material}
      </mesh>
      
      {/* Collar */}
      <mesh position={[0, 1.2, 0.15]}>
        <boxGeometry args={[0.8, 0.3, 0.3]} />
        {material}
      </mesh>
      
      {/* Zipper */}
      <mesh position={[0, 0, 0.21]}>
        <boxGeometry args={[0.1, 1.8, 0.05]} />
        <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* Pockets */}
      <mesh position={[-0.5, -0.3, 0.21]}>
        <boxGeometry args={[0.4, 0.4, 0.05]} />
        {material}
      </mesh>
      <mesh position={[0.5, -0.3, 0.21]}>
        <boxGeometry args={[0.4, 0.4, 0.05]} />
        {material}
      </mesh>
    </group>
  );
};

const CargoModel = ({ color = "#3a3a3a", texture }: { color?: string; texture?: THREE.Texture | null }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  const material = texture 
    ? <meshStandardMaterial map={texture} roughness={0.8} metalness={0.05} />
    : <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />;

  return (
    <group ref={meshRef}>
      {/* Waist */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.4, 0.3, 0.5]} />
        {material}
      </mesh>
      
      {/* Left Leg */}
      <mesh position={[-0.4, -0.5, 0]}>
        <boxGeometry args={[0.6, 1.8, 0.5]} />
        {material}
      </mesh>
      
      {/* Right Leg */}
      <mesh position={[0.4, -0.5, 0]}>
        <boxGeometry args={[0.6, 1.8, 0.5]} />
        {material}
      </mesh>
      
      {/* Left Cargo Pocket */}
      <mesh position={[-0.4, 0, 0.26]}>
        <boxGeometry args={[0.4, 0.5, 0.1]} />
        {material}
      </mesh>
      
      {/* Right Cargo Pocket */}
      <mesh position={[0.4, 0, 0.26]}>
        <boxGeometry args={[0.4, 0.5, 0.1]} />
        {material}
      </mesh>
      
      {/* Belt Loops */}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.65, 0]}>
          <boxGeometry args={[0.08, 0.15, 0.08]} />
          {material}
        </mesh>
      ))}
    </group>
  );
};

const Scene = ({ category, color, productImage }: { category: string; color?: string; productImage?: string }) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (productImage) {
      const loader = new THREE.TextureLoader();
      loader.load(
        productImage,
        (loadedTexture) => {
          loadedTexture.wrapS = THREE.RepeatWrapping;
          loadedTexture.wrapT = THREE.RepeatWrapping;
          loadedTexture.repeat.set(1, 1);
          setTexture(loadedTexture);
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error);
          setTexture(null);
        }
      );
    }
  }, [productImage]);

  const getModelColor = () => {
    if (color) return color;
    
    switch (category.toLowerCase()) {
      case 'tshirt':
      case 't-shirt':
        return '#ffffff';
      case 'jacket':
        return '#1a1a1a';
      case 'cargo':
      case 'pants':
        return '#3a3a3a';
      default:
        return '#ffffff';
    }
  };

  const renderModel = () => {
    const modelColor = getModelColor();
    
    switch (category.toLowerCase()) {
      case 'tshirt':
      case 't-shirt':
        return <TShirtModel color={modelColor} texture={texture} />;
      case 'jacket':
        return <JacketModel color={modelColor} texture={texture} />;
      case 'cargo':
      case 'pants':
        return <CargoModel color={modelColor} texture={texture} />;
      default:
        return <TShirtModel color={modelColor} texture={texture} />;
    }
  };

  return (
    <>
      <ambientLight intensity={0.6} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      
      {renderModel()}
      
      <Environment preset="studio" />
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

const Product3DViewer: React.FC<Product3DViewerProps> = ({ category, color, productImage }) => {
  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Scene category={category} color={color} productImage={productImage} />
      </Canvas>
    </div>
  );
};

export default Product3DViewer;
