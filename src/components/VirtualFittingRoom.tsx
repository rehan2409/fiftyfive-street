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
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
    }
  });

  return (
    <group ref={meshRef} position={[0, -1, 0]}>
      {/* Head - Proper Bitmoji proportions */}
      <mesh position={[0, 1.5, 0]} scale={[1, 1.1, 1]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>

      {/* Eyes - Large and expressive like Bitmoji */}
      <mesh position={[-0.13, 1.58, 0.38]} scale={[1, 0.8, 0.5]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.13, 1.58, 0.38]} scale={[1, 0.8, 0.5]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
      
      {/* Pupils with realistic coloring */}
      <mesh position={[-0.13, 1.58, 0.42]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshToonMaterial color="#3a5998" />
      </mesh>
      <mesh position={[0.13, 1.58, 0.42]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshToonMaterial color="#3a5998" />
      </mesh>

      {/* Eye highlights for life */}
      <mesh position={[-0.11, 1.6, 0.44]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshToonMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.15, 1.6, 0.44]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshToonMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>

      {/* Eyebrows - More defined */}
      <mesh position={[-0.13, 1.68, 0.36]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.18, 0.04, 0.03]} />
        <meshToonMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.13, 1.68, 0.36]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.18, 0.04, 0.03]} />
        <meshToonMaterial color="#8B4513" />
      </mesh>

      {/* Nose - More realistic shape */}
      <mesh position={[0, 1.48, 0.4]}>
        <coneGeometry args={[0.03, 0.08, 8]} />
        <meshToonMaterial color="#e8a687" />
      </mesh>
      <mesh position={[-0.02, 1.44, 0.41]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshToonMaterial color="#e8a687" />
      </mesh>
      <mesh position={[0.02, 1.44, 0.41]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshToonMaterial color="#e8a687" />
      </mesh>

      {/* Mouth - Confident smile */}
      <mesh position={[0, 1.32, 0.38]} rotation={[0, 0, 0]} scale={[1.2, 0.6, 0.8]}>
        <torusGeometry args={[0.06, 0.02, 8, 16, Math.PI]} />
        <meshToonMaterial color="#FF6B6B" />
      </mesh>
      
      {/* Teeth */}
      <mesh position={[0, 1.325, 0.4]} scale={[0.8, 0.3, 0.5]}>
        <boxGeometry args={[0.12, 0.03, 0.02]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>

      {/* Hair - Modern style like Bitmoji */}
      <mesh position={[0, 1.82, 0.05]} scale={[1.15, 0.9, 1.2]}>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshToonMaterial color="#654321" />
      </mesh>
      
      {/* Hair texture/waves */}
      <mesh position={[-0.18, 1.9, 0.25]} rotation={[0, 0, -0.3]} scale={[0.5, 0.8, 0.6]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshToonMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[0.18, 1.9, 0.25]} rotation={[0, 0, 0.3]} scale={[0.5, 0.8, 0.6]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshToonMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[0, 2.0, 0.2]} scale={[0.8, 0.6, 0.7]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshToonMaterial color="#5a3a1a" />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.38, 1.55, 0]} rotation={[0, 0, -0.2]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>
      <mesh position={[0.38, 1.55, 0]} rotation={[0, 0, 0.2]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.3, 16]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>

      {/* Body - Athletic build */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.7, 1.0, 0.3]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>

      {/* Arms with proper proportions */}
      <mesh position={[-0.45, 0.6, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 16]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>
      <mesh position={[0.45, 0.6, 0]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 16]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>

      {/* Forearms */}
      <mesh position={[-0.65, 0.15, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.06, 0.5, 4, 16]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>
      <mesh position={[0.65, 0.15, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.06, 0.5, 4, 16]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>

      {/* Hands with fingers */}
      <group position={[-0.8, -0.15, 0]}>
        {/* Palm */}
        <mesh>
          <boxGeometry args={[0.08, 0.12, 0.04]} />
          <meshToonMaterial color="#f4c2a1" />
        </mesh>
        {/* Thumb */}
        <mesh position={[0.05, 0.02, 0]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.015, 0.06, 4, 8]} />
          <meshToonMaterial color="#f4c2a1" />
        </mesh>
        {/* Fingers */}
        {[-0.03, -0.01, 0.01, 0.03].map((x, i) => (
          <mesh key={i} position={[x, -0.08, 0]}>
            <capsuleGeometry args={[0.012, 0.07, 4, 8]} />
            <meshToonMaterial color="#f4c2a1" />
          </mesh>
        ))}
      </group>

      <group position={[0.8, -0.15, 0]}>
        {/* Palm */}
        <mesh>
          <boxGeometry args={[0.08, 0.12, 0.04]} />
          <meshToonMaterial color="#f4c2a1" />
        </mesh>
        {/* Thumb */}
        <mesh position={[-0.05, 0.02, 0]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.015, 0.06, 4, 8]} />
          <meshToonMaterial color="#f4c2a1" />
        </mesh>
        {/* Fingers */}
        {[-0.03, -0.01, 0.01, 0.03].map((x, i) => (
          <mesh key={i} position={[x, -0.08, 0]}>
            <capsuleGeometry args={[0.012, 0.07, 4, 8]} />
            <meshToonMaterial color="#f4c2a1" />
          </mesh>
        ))}
      </group>

      {/* Legs with proper proportions */}
      <mesh position={[-0.15, -0.45, 0]}>
        <capsuleGeometry args={[0.12, 0.9, 4, 16]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>
      <mesh position={[0.15, -0.45, 0]}>
        <capsuleGeometry args={[0.12, 0.9, 4, 16]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>

      {/* Feet with toes */}
      <group position={[-0.15, -1.05, 0.15]}>
        <mesh>
          <boxGeometry args={[0.18, 0.1, 0.35]} />
          <meshToonMaterial color="#f4c2a1" />
        </mesh>
        {/* Toes */}
        {[-0.06, -0.03, 0, 0.03, 0.06].map((x, i) => (
          <mesh key={i} position={[x, -0.02, 0.15]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshToonMaterial color="#f4c2a1" />
          </mesh>
        ))}
      </group>

      <group position={[0.15, -1.05, 0.15]}>
        <mesh>
          <boxGeometry args={[0.18, 0.1, 0.35]} />
          <meshToonMaterial color="#f4c2a1" />
        </mesh>
        {/* Toes */}
        {[-0.06, -0.03, 0, 0.03, 0.06].map((x, i) => (
          <mesh key={i} position={[x, -0.02, 0.15]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshToonMaterial color="#f4c2a1" />
          </mesh>
        ))}
      </group>

      {/* Clothing */}
      {/* T-Shirt */}
      {selectedOutfit.tshirt && (
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.72, 0.9, 0.32]} />
          <meshStandardMaterial 
            color={selectedOutfit.tshirt.color || "#ffffff"} 
            transparent
            opacity={0.9}
          />
        </mesh>
      )}

      {/* Jacket */}
      {selectedOutfit.jacket && (
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.76, 0.95, 0.36]} />
          <meshStandardMaterial 
            color={selectedOutfit.jacket.color || "#2c3e50"} 
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {/* Cargo Pants */}
      {selectedOutfit.cargo && (
        <group position={[0, -0.2, 0]}>
          <mesh position={[-0.15, -0.25, 0]}>
            <boxGeometry args={[0.26, 0.9, 0.25]} />
            <meshStandardMaterial 
              color={selectedOutfit.cargo.color || "#4a5568"} 
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh position={[0.15, -0.25, 0]}>
            <boxGeometry args={[0.26, 0.9, 0.25]} />
            <meshStandardMaterial 
              color={selectedOutfit.cargo.color || "#4a5568"} 
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Female Character Component - Snapchat/Bitmoji Style
const FemaleCharacter = ({ selectedOutfit }: { selectedOutfit: any }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
    }
  });

  return (
    <group ref={meshRef} position={[0, -1, 0]}>
      {/* Head - Proper female Bitmoji proportions */}
      <mesh position={[0, 1.5, 0]} scale={[0.95, 1.05, 1]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshToonMaterial color="#fdd5c4" />
      </mesh>

      {/* Eyes - Large and beautiful like female Bitmoji */}
      <mesh position={[-0.12, 1.6, 0.36]} scale={[1, 0.85, 0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.12, 1.6, 0.36]} scale={[1, 0.85, 0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
      
      {/* Pupils with beautiful eye color */}
      <mesh position={[-0.12, 1.6, 0.4]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshToonMaterial color="#2E8B57" />
      </mesh>
      <mesh position={[0.12, 1.6, 0.4]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshToonMaterial color="#2E8B57" />
      </mesh>

      {/* Eye highlights for sparkle */}
      <mesh position={[-0.1, 1.63, 0.42]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshToonMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.14, 1.63, 0.42]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshToonMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>

      {/* Eyelashes - More prominent */}
      <mesh position={[-0.12, 1.7, 0.34]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.15, 0.03, 0.02]} />
        <meshToonMaterial color="#000000" />
      </mesh>
      <mesh position={[0.12, 1.7, 0.34]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.15, 0.03, 0.02]} />
        <meshToonMaterial color="#000000" />
      </mesh>
      
      {/* Individual eyelashes */}
      {[-0.18, -0.15, -0.12, -0.09, -0.06].map((x, i) => (
        <mesh key={i} position={[x, 1.72, 0.32]} rotation={[0, 0, 0.1 + i * 0.05]}>
          <boxGeometry args={[0.02, 0.04, 0.01]} />
          <meshToonMaterial color="#000000" />
        </mesh>
      ))}
      {[0.06, 0.09, 0.12, 0.15, 0.18].map((x, i) => (
        <mesh key={i} position={[x, 1.72, 0.32]} rotation={[0, 0, -0.1 - i * 0.05]}>
          <boxGeometry args={[0.02, 0.04, 0.01]} />
          <meshToonMaterial color="#000000" />
        </mesh>
      ))}

      {/* Eyebrows - Perfectly shaped */}
      <mesh position={[-0.12, 1.72, 0.32]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.16, 0.025, 0.02]} />
        <meshToonMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.12, 1.72, 0.32]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.16, 0.025, 0.02]} />
        <meshToonMaterial color="#8B4513" />
      </mesh>

      {/* Nose - Delicate and refined */}
      <mesh position={[0, 1.48, 0.38]}>
        <coneGeometry args={[0.025, 0.06, 8]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>
      <mesh position={[-0.015, 1.44, 0.39]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>
      <mesh position={[0.015, 1.44, 0.39]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshToonMaterial color="#f4c2a1" />
      </mesh>

      {/* Lips - Full and glossy */}
      <mesh position={[0, 1.32, 0.36]} scale={[1.1, 0.7, 0.8]}>
        <torusGeometry args={[0.055, 0.025, 8, 16, Math.PI]} />
        <meshToonMaterial color="#FF69B4" />
      </mesh>
      <mesh position={[0, 1.315, 0.37]} scale={[0.8, 0.5, 0.6]}>
        <torusGeometry args={[0.04, 0.015, 8, 16, Math.PI]} />
        <meshToonMaterial color="#FF1493" />
      </mesh>

      {/* Teeth */}
      <mesh position={[0, 1.325, 0.38]} scale={[0.7, 0.25, 0.4]}>
        <boxGeometry args={[0.1, 0.025, 0.015]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>

      {/* Hair - Long and flowing like female Bitmoji */}
      <mesh position={[0, 1.85, 0]} scale={[1.3, 1.1, 1.3]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshToonMaterial color="#D4A574" />
      </mesh>
      
      {/* Long hair sides */}
      <mesh position={[-0.32, 1.4, 0]} scale={[0.6, 1.8, 0.8]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshToonMaterial color="#D4A574" />
      </mesh>
      <mesh position={[0.32, 1.4, 0]} scale={[0.6, 1.8, 0.8]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshToonMaterial color="#D4A574" />
      </mesh>

      {/* Hair back flow */}
      <mesh position={[0, 1.6, -0.25]} scale={[1.1, 1.5, 0.6]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshToonMaterial color="#D4A574" />
      </mesh>

      {/* Bangs */}
      <mesh position={[0, 1.88, 0.28]} scale={[1.1, 0.35, 0.5]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshToonMaterial color="#D4A574" />
      </mesh>

      {/* Hair highlights */}
      <mesh position={[-0.1, 1.9, 0.25]} scale={[0.3, 0.8, 0.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshToonMaterial color="#E6C68A" />
      </mesh>
      <mesh position={[0.1, 1.9, 0.25]} scale={[0.3, 0.8, 0.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshToonMaterial color="#E6C68A" />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.35, 1.55, 0]} rotation={[0, 0, -0.2]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshToonMaterial color="#fdd5c4" />
      </mesh>
      <mesh position={[0.35, 1.55, 0]} rotation={[0, 0, 0.2]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshToonMaterial color="#fdd5c4" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 0.28, 16]} />
        <meshToonMaterial color="#fdd5c4" />
      </mesh>

      {/* Body - Feminine proportions */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.55, 0.9, 0.25]} />
        <meshToonMaterial color="#fdd5c4" />
      </mesh>

      {/* Arms - Slender and graceful */}
      <mesh position={[-0.35, 0.65, 0]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.06, 0.55, 4, 16]} />
        <meshToonMaterial color="#fdd5c4" />
      </mesh>
      <mesh position={[0.35, 0.65, 0]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.06, 0.55, 4, 16]} />
        <meshToonMaterial color="#fdd5c4" />
      </mesh>

      {/* Forearms */}
      <mesh position={[-0.55, 0.2, 0]} rotation={[0, 0, 0.25]}>
        <capsuleGeometry args={[0.05, 0.45, 4, 16]} />
        <meshToonMaterial color="#fdd5c4" />
      </mesh>
      <mesh position={[0.55, 0.2, 0]} rotation={[0, 0, -0.25]}>
        <capsuleGeometry args={[0.05, 0.45, 4, 16]} />
        <meshToonMaterial color="#fdd5c4" />
      </mesh>

      {/* Hands with delicate fingers */}
      <group position={[-0.68, -0.08, 0]}>
        {/* Palm */}
        <mesh>
          <boxGeometry args={[0.06, 0.1, 0.03]} />
          <meshToonMaterial color="#fdd5c4" />
        </mesh>
        {/* Thumb */}
        <mesh position={[0.04, 0.015, 0]} rotation={[0, 0, 0.4]}>
          <capsuleGeometry args={[0.012, 0.05, 4, 8]} />
          <meshToonMaterial color="#fdd5c4" />
        </mesh>
        {/* Fingers - more delicate */}
        {[-0.025, -0.008, 0.008, 0.025].map((x, i) => (
          <mesh key={i} position={[x, -0.065, 0]}>
            <capsuleGeometry args={[0.01, 0.06, 4, 8]} />
            <meshToonMaterial color="#fdd5c4" />
          </mesh>
        ))}
        {/* Nail polish */}
        {[-0.025, -0.008, 0.008, 0.025].map((x, i) => (
          <mesh key={i} position={[x, -0.09, 0.005]}>
            <sphereGeometry args={[0.008, 6, 6]} />
            <meshToonMaterial color="#FF69B4" />
          </mesh>
        ))}
      </group>

      <group position={[0.68, -0.08, 0]}>
        {/* Palm */}
        <mesh>
          <boxGeometry args={[0.06, 0.1, 0.03]} />
          <meshToonMaterial color="#fdd5c4" />
        </mesh>
        {/* Thumb */}
        <mesh position={[-0.04, 0.015, 0]} rotation={[0, 0, -0.4]}>
          <capsuleGeometry args={[0.012, 0.05, 4, 8]} />
          <meshToonMaterial color="#fdd5c4" />
        </mesh>
        {/* Fingers - more delicate */}
        {[-0.025, -0.008, 0.008, 0.025].map((x, i) => (
          <mesh key={i} position={[x, -0.065, 0]}>
            <capsuleGeometry args={[0.01, 0.06, 4, 8]} />
            <meshToonMaterial color="#fdd5c4" />
          </mesh>
        ))}
        {/* Nail polish */}
        {[-0.025, -0.008, 0.008, 0.025].map((x, i) => (
          <mesh key={i} position={[x, -0.09, 0.005]}>
            <sphereGeometry args={[0.008, 6, 6]} />
            <meshToonMaterial color="#FF69B4" />
          </mesh>
        ))}
      </group>

      {/* Legs - Feminine proportions */}
      <mesh position={[-0.12, -0.42, 0]}>
        <capsuleGeometry args={[0.1, 0.85, 4, 16]} />
        <meshToonMaterial color="#fdd5c4" />
      </mesh>
      <mesh position={[0.12, -0.42, 0]}>
        <capsuleGeometry args={[0.1, 0.85, 4, 16]} />
        <meshToonMaterial color="#fdd5c4" />
      </mesh>

      {/* Feet with painted toenails */}
      <group position={[-0.12, -0.98, 0.12]}>
        <mesh>
          <boxGeometry args={[0.15, 0.08, 0.28]} />
          <meshToonMaterial color="#fdd5c4" />
        </mesh>
        {/* Toes with nail polish */}
        {[-0.05, -0.025, 0, 0.025, 0.05].map((x, i) => (
          <group key={i}>
            <mesh position={[x, -0.015, 0.12]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshToonMaterial color="#fdd5c4" />
            </mesh>
            <mesh position={[x, -0.02, 0.125]}>
              <sphereGeometry args={[0.008, 6, 6]} />
              <meshToonMaterial color="#FF1493" />
            </mesh>
          </group>
        ))}
      </group>

      <group position={[0.12, -0.98, 0.12]}>
        <mesh>
          <boxGeometry args={[0.15, 0.08, 0.28]} />
          <meshToonMaterial color="#fdd5c4" />
        </mesh>
        {/* Toes with nail polish */}
        {[-0.05, -0.025, 0, 0.025, 0.05].map((x, i) => (
          <group key={i}>
            <mesh position={[x, -0.015, 0.12]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshToonMaterial color="#fdd5c4" />
            </mesh>
            <mesh position={[x, -0.02, 0.125]}>
              <sphereGeometry args={[0.008, 6, 6]} />
              <meshToonMaterial color="#FF1493" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Clothing */}
      {/* T-Shirt - More fitted */}
      {selectedOutfit.tshirt && (
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.57, 0.85, 0.27]} />
          <meshStandardMaterial 
            color={selectedOutfit.tshirt.color || "#FF69B4"} 
            transparent
            opacity={0.9}
          />
        </mesh>
      )}

      {/* Jacket - Stylish fit */}
      {selectedOutfit.jacket && (
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.61, 0.9, 0.31]} />
          <meshStandardMaterial 
            color={selectedOutfit.jacket.color || "#9B59B6"} 
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {/* Cargo Pants - Tailored fit */}
      {selectedOutfit.cargo && (
        <group position={[0, -0.15, 0]}>
          <mesh position={[-0.12, -0.25, 0]}>
            <boxGeometry args={[0.22, 0.85, 0.22]} />
            <meshStandardMaterial 
              color={selectedOutfit.cargo.color || "#34495E"} 
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh position={[0.12, -0.25, 0]}>
            <boxGeometry args={[0.22, 0.85, 0.22]} />
            <meshStandardMaterial 
              color={selectedOutfit.cargo.color || "#34495E"} 
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
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