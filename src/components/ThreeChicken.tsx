import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cone, Float, ContactShadows, useCursor, Html } from '@react-three/drei';
import * as THREE from 'three';

function ChickenModel({ hovered, setHovered, message }: { hovered: boolean, setHovered: (h: boolean) => void, message: React.ReactNode }) {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const wingsRef = useRef<THREE.Group>(null);

  // Materials
  const featherMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#FFFACD', // Lemon Chiffon
    roughness: 1, 
    metalness: 0
  }), []);
  
  const beakMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#FFD700', // Gold
    roughness: 0.4, 
    metalness: 0.1
  }), []);

  const combMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#FF4500', // Orange Red
    roughness: 0.6,
    metalness: 0
  }), []);

  const eyeMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ 
    color: '#000000', 
    roughness: 0.1, 
    metalness: 0.5,
    clearcoat: 1
  }), []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useFrame((state) => {
    if (!bodyRef.current || !wingsRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Bobbing
    bodyRef.current.position.y = Math.sin(time * 4) * 0.05;
    
    // Wings flapping
    wingsRef.current.rotation.z = Math.sin(time * 10) * 0.1;
    
    // Mouse follow
    const mouseX = state.mouse.x * 0.3;
    const mouseY = state.mouse.y * 0.3;
    bodyRef.current.rotation.y = THREE.MathUtils.lerp(bodyRef.current.rotation.y, mouseX, 0.1);
    bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, -mouseY * 0.5, 0.1);
  });

  return (
    <group 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      scale={[isMobile ? 0.8 : 1.1, isMobile ? 0.8 : 1.1, isMobile ? 0.8 : 1.1]}
      position={[isMobile ? -0.3 : 0, -0.4, 0]}
    >
      <group ref={bodyRef}>
        {/* Body - Egg shape */}
        <Sphere args={[0.7, 64, 64]} scale={[1, 1.2, 1]}>
          <primitive object={featherMaterial} />
        </Sphere>

        {/* Comb (Red thing on top) */}
        <group position={[0, 0.8, 0]}>
          <Sphere args={[0.15, 32, 32]} position={[0, 0, 0.1]} scale={[0.5, 1, 1]}>
            <primitive object={combMaterial} />
          </Sphere>
          <Sphere args={[0.12, 32, 32]} position={[0, -0.05, -0.1]} scale={[0.5, 1, 1]}>
            <primitive object={combMaterial} />
          </Sphere>
          <Sphere args={[0.1, 32, 32]} position={[0, -0.1, 0.25]} scale={[0.5, 1, 1]}>
            <primitive object={combMaterial} />
          </Sphere>
        </group>

        {/* Eyes */}
        <Sphere args={[0.06, 32, 32]} position={[0.2, 0.2, 0.55]}>
          <primitive object={eyeMaterial} />
        </Sphere>
        <Sphere args={[0.06, 32, 32]} position={[-0.2, 0.2, 0.55]}>
          <primitive object={eyeMaterial} />
        </Sphere>

        {/* Beak */}
        <Cone args={[0.1, 0.2, 32]} position={[0, 0.1, 0.65]} rotation={[1.57, 0, 0]}>
          <primitive object={beakMaterial} />
        </Cone>

        {/* Wattle (Red thing under beak) */}
        <Sphere args={[0.08, 32, 32]} position={[0, -0.05, 0.6]}>
          <primitive object={combMaterial} />
        </Sphere>

        {/* Wings */}
        <group ref={wingsRef}>
          <Sphere args={[0.4, 32, 32]} position={[0.6, 0, 0]} scale={[0.2, 1, 0.8]} rotation={[0, 0, -0.2]}>
            <primitive object={featherMaterial} />
          </Sphere>
          <Sphere args={[0.4, 32, 32]} position={[-0.6, 0, 0]} scale={[0.2, 1, 0.8]} rotation={[0, 0, 0.2]}>
            <primitive object={featherMaterial} />
          </Sphere>
        </group>

        {/* Feet */}
        <group position={[0, -0.8, 0]}>
           <Cylinder args={[0.03, 0.03, 0.3]} position={[0.2, 0, 0]} material={beakMaterial} />
           <Cylinder args={[0.03, 0.03, 0.3]} position={[-0.2, 0, 0]} material={beakMaterial} />
           {/* Toes */}
           <Cone args={[0.05, 0.15, 8]} position={[0.2, -0.15, 0.1]} rotation={[1, 0, 0]} material={beakMaterial} />
           <Cone args={[0.05, 0.15, 8]} position={[-0.2, -0.15, 0.1]} rotation={[1, 0, 0]} material={beakMaterial} />
        </group>

        {/* Chat Bubble */}
        <Html 
          position={[isMobile ? 0.5 : 0.6, isMobile ? 0.3 : 0.4, 0]} 
          center 
          className="pointer-events-none w-40 sm:w-64 md:w-72" 
          style={{ transform: 'scale(1)', zIndex: 0 }}
          zIndexRange={[0, 0]}
        >
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 md:px-5 md:py-4 rounded-2xl rounded-tl-none shadow-xl border border-orange-100 relative animate-in zoom-in duration-300 origin-top-left flex items-center min-h-[50px] md:min-h-[60px]">
            <div className="text-amber-900/90 text-[10px] md:text-sm font-medium leading-relaxed text-left break-words whitespace-pre-wrap w-full">
              {message}
            </div>
            <div className="absolute top-3 md:top-4 -left-2 w-0 h-0 border-t-[6px] md:border-t-[8px] border-t-transparent border-r-[8px] md:border-r-[10px] border-r-white/95 border-b-[6px] md:border-b-[8px] border-b-transparent"></div>
          </div>
        </Html>
      </group>
    </group>
  );
}

export default function ThreeChicken({ message }: { message?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <div className="w-full h-96 relative -mt-8 -mb-12">
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={0.8} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#FFFACD" />
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
          <ChickenModel hovered={hovered} setHovered={setHovered} message={message} />
        </Float>
        <ContactShadows position={[0, -1.4, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#DAA520" />
      </Canvas>
    </div>
  );
}