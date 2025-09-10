import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useThreeTheme } from "@/contexts/ThreeThemeContext";

function FloatingOrb({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { currentTheme } = useThreeTheme();

  useFrame((state) => {
    if (meshRef.current) {
      const speed = currentTheme.animations.speed;
      const intensity = currentTheme.animations.intensity;
      
      // Apply pattern-based movement
      let x = position[0], y = position[1];
      
      switch (currentTheme.patterns) {
        case 'spiral':
          const spiralTime = state.clock.elapsedTime * speed * 0.3;
          x = position[0] + Math.cos(spiralTime) * 3 * intensity;
          y = position[1] + Math.sin(spiralTime) * 2 * intensity;
          break;
        case 'wave':
          x = position[0] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 2 * intensity;
          y = position[1] + Math.cos(state.clock.elapsedTime * speed * 0.3) * 1.5 * intensity;
          break;
        case 'chaos':
          x = position[0] + (Math.sin(state.clock.elapsedTime * speed * 0.7) + Math.cos(state.clock.elapsedTime * speed * 0.4)) * intensity;
          y = position[1] + (Math.cos(state.clock.elapsedTime * speed * 0.8) + Math.sin(state.clock.elapsedTime * speed * 0.6)) * intensity;
          break;
        default:
          x = position[0] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 2 * intensity;
          y = position[1] + Math.cos(state.clock.elapsedTime * speed * 0.3) * 1.5 * intensity;
      }
      
      meshRef.current.position.x = x;
      meshRef.current.position.y = y;
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
    }
  });

  const opacity = currentTheme.effects === 'subtle' ? 0.05 : currentTheme.effects === 'intense' ? 0.2 : 0.1;

  return (
    <Sphere ref={meshRef} position={position} args={[1.5, 32, 32]}>
      <meshBasicMaterial
        color={currentTheme.colors.primary}
        transparent
        opacity={opacity}
        wireframe
      />
    </Sphere>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { currentTheme } = useThreeTheme();
  
  const particleCount = currentTheme.animations.particleCount;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      const speed = currentTheme.animations.speed;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05 * speed;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02 * speed;
    }
  });

  const opacity = currentTheme.effects === 'subtle' ? 0.3 : currentTheme.effects === 'intense' ? 0.8 : 0.6;

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial
        color={currentTheme.colors.particles}
        size={currentTheme.animations.particleSize}
        transparent
        opacity={opacity}
        sizeAttenuation
      />
    </Points>
  );
}

function GlowingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { currentTheme } = useThreeTheme();

  useFrame((state) => {
    if (meshRef.current) {
      const speed = currentTheme.animations.speed;
      const intensity = currentTheme.animations.intensity;
      
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1 * speed;
      
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 * speed) * 0.1 * intensity;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const opacity = currentTheme.effects === 'subtle' ? 0.02 : currentTheme.effects === 'intense' ? 0.1 : 0.05;

  return (
    <Sphere ref={meshRef} position={[0, 0, -5]} args={[3, 64, 64]}>
      <meshBasicMaterial
        color={currentTheme.colors.glow}
        transparent
        opacity={opacity}
      />
    </Sphere>
  );
}

// Fallback CSS background when WebGL is not available
function FallbackBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 animate-pulse"></div>
        
        {/* Floating CSS orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-pink-500/10 rounded-full blur-xl animate-float animation-delay-2000"></div>
        
        {/* Animated particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ThreeBackground() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS animations');
      setHasWebGL(false);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <FallbackBackground />;
  }

  if (!hasWebGL) {
    return <FallbackBackground />;
  }

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: "transparent" }}
        onCreated={(state) => {
          console.log('Three.js Canvas created successfully');
        }}
        onError={(error) => {
          console.error('Three.js Canvas error:', error);
          setHasWebGL(false);
        }}
        fallback={<FallbackBackground />}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <GlowingOrb />
        <FloatingOrb position={[-8, 3, -2]} />
        <FloatingOrb position={[8, -2, -3]} />
        <FloatingOrb position={[0, 5, -4]} />
        <ParticleField />
      </Canvas>
    </div>
  );
}
