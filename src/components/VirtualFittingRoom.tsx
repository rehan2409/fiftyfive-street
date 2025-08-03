import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, RotateCcw, Palette, Users } from 'lucide-react';

// Male Character Component - Snapchat/Bitmoji Style
const MaleCharacter = ({ selectedOutfit }: { selectedOutfit: any }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, -1, 0]}>
      {/* Large cartoon head - Bitmoji style */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.5, 20, 20]} />
        <meshToonMaterial color="#f9c2a8" />
      </mesh>

      {/* Large cartoon eyes */}
      <mesh position={[-0.15, 1.6, 0.45]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.15, 1.6, 0.45]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
      
      {/* Large pupils */}
      <mesh position={[-0.15, 1.6, 0.52]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshToonMaterial color="#333333" />
      </mesh>
      <mesh position={[0.15, 1.6, 0.52]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshToonMaterial color="#333333" />
      </mesh>

      {/* Eyebrows */}
      <mesh position={[-0.15, 1.75, 0.4]} rotation={[0, 0, 0.2]} scale={[1, 0.3, 0.5]}>
        <boxGeometry args={[0.15, 0.05, 0.05]} />
        <meshToonMaterial color="#654321" />
      </mesh>
      <mesh position={[0.15, 1.75, 0.4]} rotation={[0, 0, -0.2]} scale={[1, 0.3, 0.5]}>
        <boxGeometry args={[0.15, 0.05, 0.05]} />
        <meshToonMaterial color="#654321" />
      </mesh>

      {/* Simple cartoon nose */}
      <mesh position={[0, 1.45, 0.48]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshToonMaterial color="#e6a085" />
      </mesh>

      {/* Smiling mouth */}
      <mesh position={[0, 1.25, 0.45]} scale={[1.5, 0.8, 0.8]}>
        <sphereGeometry args={[0.08, 12, 8]} />
        <meshToonMaterial color="#ff6b6b" />
      </mesh>

      {/* Stylized hair - messy/trendy */}
      <mesh position={[0, 1.85, 0]} scale={[1.2, 0.8, 1.2]}>
        <sphereGeometry args={[0.45, 8, 8]} />
        <meshToonMaterial color="#8b4513" />
      </mesh>
      
      {/* Hair spikes */}
      <mesh position={[-0.2, 2.2, 0.1]} rotation={[0, 0, -0.3]} scale={[0.6, 1.2, 0.6]}>
        <coneGeometry args={[0.08, 0.3, 6]} />
        <meshToonMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0.2, 2.2, 0.1]} rotation={[0, 0, 0.3]} scale={[0.6, 1.2, 0.6]}>
        <coneGeometry args={[0.08, 0.3, 6]} />
        <meshToonMaterial color="#8b4513" />
      </mesh>

      {/* Simplified cartoon body */}
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.35, 1.2, 4, 8]} />
        <meshToonMaterial color="#f9c2a8" />
      </mesh>

      {/* Simple cartoon arms */}
      <mesh position={[-0.5, 0.7, 0]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.08, 0.8, 4, 8]} />
        <meshToonMaterial color="#f9c2a8" />
      </mesh>
      <mesh position={[0.5, 0.7, 0]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.08, 0.8, 4, 8]} />
        <meshToonMaterial color="#f9c2a8" />
      </mesh>

      {/* Cartoon hands */}
      <mesh position={[-0.75, 0.2, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshToonMaterial color="#f9c2a8" />
      </mesh>
      <mesh position={[0.75, 0.2, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshToonMaterial color="#f9c2a8" />
      </mesh>

      {/* Simple cartoon legs */}
      <mesh position={[-0.15, -0.5, 0]}>
        <capsuleGeometry args={[0.12, 1.2, 4, 8]} />
        <meshToonMaterial color="#f9c2a8" />
      </mesh>
      <mesh position={[0.15, -0.5, 0]}>
        <capsuleGeometry args={[0.12, 1.2, 4, 8]} />
        <meshToonMaterial color="#f9c2a8" />
      </mesh>

      {/* Cartoon shoes */}
      <mesh position={[-0.15, -1.2, 0.1]}>
        <boxGeometry args={[0.2, 0.15, 0.4]} />
        <meshToonMaterial color="#333333" />
      </mesh>
      <mesh position={[0.15, -1.2, 0.1]}>
        <boxGeometry args={[0.2, 0.15, 0.4]} />
        <meshToonMaterial color="#333333" />
      </mesh>

      {/* T-Shirt */}
      {selectedOutfit.tshirt && (
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.36, 0.46, 1.2, 8]} />
          <meshStandardMaterial 
            color={selectedOutfit.tshirt.color || "#ffffff"} 
            transparent
            opacity={0.9}
          />
        </mesh>
      )}

      {/* Jacket */}
      {selectedOutfit.jacket && (
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.38, 0.48, 1.3, 8]} />
          <meshStandardMaterial 
            color={selectedOutfit.jacket.color || "#2c3e50"} 
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Cargo Pants */}
      {selectedOutfit.cargo && (
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.37, 0.40, 1.3, 8]} />
          <meshStandardMaterial 
            color={selectedOutfit.cargo.color || "#4a5568"} 
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
    </group>
  );
};

// Female Character Component - Snapchat/Bitmoji Style
const FemaleCharacter = ({ selectedOutfit }: { selectedOutfit: any }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, -1, 0]}>
      {/* Large cartoon head - Female Bitmoji style */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.45, 20, 20]} />
        <meshToonMaterial color="#ffc9b3" />
      </mesh>

      {/* Large beautiful cartoon eyes */}
      <mesh position={[-0.12, 1.65, 0.4]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.12, 1.65, 0.4]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
      
      {/* Large pupils with sparkle */}
      <mesh position={[-0.12, 1.65, 0.48]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshToonMaterial color="#2b4a87" />
      </mesh>
      <mesh position={[0.12, 1.65, 0.48]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshToonMaterial color="#2b4a87" />
      </mesh>

      {/* Eye highlights */}
      <mesh position={[-0.1, 1.68, 0.5]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.14, 1.68, 0.5]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>

      {/* Beautiful long eyelashes */}
      <mesh position={[-0.12, 1.75, 0.42]} rotation={[0, 0, 0.1]} scale={[1.5, 0.2, 0.3]}>
        <boxGeometry args={[0.08, 0.03, 0.02]} />
        <meshToonMaterial color="#333333" />
      </mesh>
      <mesh position={[0.12, 1.75, 0.42]} rotation={[0, 0, -0.1]} scale={[1.5, 0.2, 0.3]}>
        <boxGeometry args={[0.08, 0.03, 0.02]} />
        <meshToonMaterial color="#333333" />
      </mesh>

      {/* Small cute nose */}
      <mesh position={[0, 1.45, 0.42]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshToonMaterial color="#f0a89a" />
      </mesh>

      {/* Glossy lips */}
      <mesh position={[0, 1.3, 0.4]} scale={[1.3, 0.7, 0.8]}>
        <sphereGeometry args={[0.06, 12, 8]} />
        <meshToonMaterial color="#ff8fab" />
      </mesh>

      {/* Beautiful long flowing hair */}
      <mesh position={[0, 1.8, -0.05]} scale={[1.4, 1.2, 1.3]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshToonMaterial color="#d4861f" />
      </mesh>
      
      {/* Hair flowing sides */}
      <mesh position={[-0.25, 1.5, 0]} scale={[0.8, 1.5, 0.8]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshToonMaterial color="#d4861f" />
      </mesh>
      <mesh position={[0.25, 1.5, 0]} scale={[0.8, 1.5, 0.8]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshToonMaterial color="#d4861f" />
      </mesh>

      {/* Hair bangs */}
      <mesh position={[0, 1.9, 0.3]} scale={[1.2, 0.4, 0.6]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshToonMaterial color="#d4861f" />
      </mesh>

      {/* Simplified cartoon body - feminine */}
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.3, 1.1, 4, 8]} />
        <meshToonMaterial color="#ffc9b3" />
      </mesh>

      {/* Simple cartoon arms */}
      <mesh position={[-0.4, 0.65, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.06, 0.7, 4, 8]} />
        <meshToonMaterial color="#ffc9b3" />
      </mesh>
      <mesh position={[0.4, 0.65, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.06, 0.7, 4, 8]} />
        <meshToonMaterial color="#ffc9b3" />
      </mesh>

      {/* Cute cartoon hands */}
      <mesh position={[-0.6, 0.15, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshToonMaterial color="#ffc9b3" />
      </mesh>
      <mesh position={[0.6, 0.15, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshToonMaterial color="#ffc9b3" />
      </mesh>

      {/* Simple cartoon legs */}
      <mesh position={[-0.12, -0.5, 0]}>
        <capsuleGeometry args={[0.1, 1.1, 4, 8]} />
        <meshToonMaterial color="#ffc9b3" />
      </mesh>
      <mesh position={[0.12, -0.5, 0]}>
        <capsuleGeometry args={[0.1, 1.1, 4, 8]} />
        <meshToonMaterial color="#ffc9b3" />
      </mesh>

      {/* Cute cartoon shoes */}
      <mesh position={[-0.12, -1.15, 0.08]}>
        <boxGeometry args={[0.18, 0.12, 0.35]} />
        <meshToonMaterial color="#ff69b4" />
      </mesh>
      <mesh position={[0.12, -1.15, 0.08]}>
        <boxGeometry args={[0.18, 0.12, 0.35]} />
        <meshToonMaterial color="#ff69b4" />
      </mesh>

      {/* T-Shirt - More fitted */}
      {selectedOutfit.tshirt && (
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.26, 0.36, 1.0, 8]} />
          <meshStandardMaterial 
            color={selectedOutfit.tshirt.color || "#ff69b4"} 
            transparent
            opacity={0.9}
          />
        </mesh>
      )}

      {/* Jacket - Stylish fit */}
      {selectedOutfit.jacket && (
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.28, 0.38, 1.1, 8]} />
          <meshStandardMaterial 
            color={selectedOutfit.jacket.color || "#9b59b6"} 
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Cargo Pants - Tailored fit */}
      {selectedOutfit.cargo && (
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.27, 0.30, 1.1, 8]} />
          <meshStandardMaterial 
            color={selectedOutfit.cargo.color || "#34495e"} 
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
    </group>
  );
};

// Floating UI Text
const FloatingText = ({ text, position }: { text: string; position: [number, number, number] }) => {
  return (
    <Text
      position={position}
      fontSize={0.2}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      font="/fonts/helvetiker_regular.typeface.json"
    >
      {text}
    </Text>
  );
};

const VirtualFittingRoom = () => {
  const { products } = useStore();
  const [selectedOutfit, setSelectedOutfit] = useState<{
    tshirt?: any;
    jacket?: any;
    cargo?: any;
  }>({});
  const [activeCategory, setActiveCategory] = useState<'tshirt' | 'jacket' | 'cargo'>('tshirt');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');

  // Filter products by category
  const getProductsByCategory = (category: string) => {
    return products.filter(product => 
      product.category.toLowerCase().includes(category.toLowerCase()) ||
      product.name.toLowerCase().includes(category.toLowerCase())
    );
  };

  const tshirts = getProductsByCategory('shirt');
  const jackets = getProductsByCategory('jacket');
  const cargo = getProductsByCategory('cargo');

  const selectItem = (item: any, category: 'tshirt' | 'jacket' | 'cargo') => {
    setSelectedOutfit(prev => ({
      ...prev,
      [category]: {
        ...item,
        color: getRandomColor()
      }
    }));
  };

  const removeItem = (category: 'tshirt' | 'jacket' | 'cargo') => {
    setSelectedOutfit(prev => ({
      ...prev,
      [category]: undefined
    }));
  };

  const getRandomColor = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const resetOutfit = () => {
    setSelectedOutfit({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Virtual Fitting Room</h1>
          <p className="text-purple-200">Try on our latest collection in 3D!</p>
          
          {/* Gender Selection */}
          <div className="flex justify-center mt-4">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-1 flex gap-1">
              <Button
                onClick={() => setSelectedGender('male')}
                variant={selectedGender === 'male' ? "default" : "ghost"}
                size="sm"
                className={`rounded-full px-6 ${
                  selectedGender === 'male' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Male Model
              </Button>
              <Button
                onClick={() => setSelectedGender('female')}
                variant={selectedGender === 'female' ? "default" : "ghost"}
                size="sm"
                className={`rounded-full px-6 ${
                  selectedGender === 'female' 
                    ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Female Model
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 3D Character Display */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 h-[600px]">
              <CardContent className="p-0 h-full">
                <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
                  <Environment preset="studio" />
                  <ambientLight intensity={0.6} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <directionalLight position={[-10, 10, 5]} intensity={0.5} />
                  
                  {selectedGender === 'male' ? (
                    <MaleCharacter selectedOutfit={selectedOutfit} />
                  ) : (
                    <FemaleCharacter selectedOutfit={selectedOutfit} />
                  )}
                  
                  {/* Floating product names */}
                  {selectedOutfit.tshirt && (
                    <FloatingText 
                      text={selectedOutfit.tshirt.name} 
                      position={[1.5, 1, 0]} 
                    />
                  )}
                  {selectedOutfit.jacket && (
                    <FloatingText 
                      text={selectedOutfit.jacket.name} 
                      position={[-1.5, 1.2, 0]} 
                    />
                  )}
                  {selectedOutfit.cargo && (
                    <FloatingText 
                      text={selectedOutfit.cargo.name} 
                      position={[0, -1.5, 0]} 
                    />
                  )}
                  
                  <OrbitControls 
                    enableZoom={false} 
                    enablePan={false}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 4}
                  />
                </Canvas>
                
                {/* Controls Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    onClick={resetOutfit}
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Selection Panel */}
          <div className="space-y-4">
            {/* Category Tabs */}
            <div className="flex gap-2">
              {[
                { key: 'tshirt' as const, label: 'T-Shirts', count: tshirts.length },
                { key: 'jacket' as const, label: 'Jackets', count: jackets.length },
                { key: 'cargo' as const, label: 'Cargo', count: cargo.length }
              ].map(({ key, label, count }) => (
                <Button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  variant={activeCategory === key ? "default" : "outline"}
                  className={`flex-1 ${
                    activeCategory === key 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/30'
                  }`}
                >
                  {label}
                  <Badge className="ml-2 bg-white/20">{count}</Badge>
                </Button>
              ))}
            </div>

            {/* Current Outfit */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3">Current Outfit</h3>
                <div className="space-y-2">
                  {selectedOutfit.tshirt ? (
                    <div className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                      <span className="text-white text-sm">{selectedOutfit.tshirt.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem('tshirt')}
                        className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">No T-shirt selected</div>
                  )}
                  
                  {selectedOutfit.jacket ? (
                    <div className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                      <span className="text-white text-sm">{selectedOutfit.jacket.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem('jacket')}
                        className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">No jacket selected</div>
                  )}
                  
                  {selectedOutfit.cargo ? (
                    <div className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                      <span className="text-white text-sm">{selectedOutfit.cargo.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem('cargo')}
                        className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">No cargo selected</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product List */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3 capitalize">{activeCategory}s</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {(() => {
                    const items = activeCategory === 'tshirt' ? tshirts : 
                                 activeCategory === 'jacket' ? jackets : cargo;
                    
                    return items.length > 0 ? items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => selectItem(item, activeCategory)}
                        className="bg-white/10 hover:bg-white/20 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:scale-105"
                      >
                        <div className="flex items-center gap-3">
                          {item.images && item.images[0] && (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-sm">{item.name}</h4>
                            <p className="text-purple-200 text-xs">₹{item.price}</p>
                          </div>
                          <Palette className="w-4 h-4 text-purple-300" />
                        </div>
                      </div>
                    )) : (
                      <div className="text-gray-400 text-center py-8">
                        No {activeCategory}s available
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualFittingRoom;