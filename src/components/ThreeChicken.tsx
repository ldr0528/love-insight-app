import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cone, Float, ContactShadows, useCursor, Html, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

function ChickenModel({ hovered, setHovered, message }: { hovered: boolean, setHovered: (h: boolean) => void, message: React.ReactNode }) {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const wingsRef = useRef<THREE.Group>(null);

  // Materials
  const featherMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#FFEB3B', // Brighter Yellow
    roughness: 0.8, 
    metalness: 0
  }), []);
  
  const beakMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#FF9800', // Orange Gold
    roughness: 0.4, 
    metalness: 0.1
  }), []);

  const combMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#D32F2F', // Deep Red
    roughness: 0.6,
    metalness: 0
  }), []);

  const eyeMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ 
    color: '#000000', 
    roughness: 0.1, 
    metalness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  }), []);
  
  const blushMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#FFB7B2', 
    roughness: 1, 
    metalness: 0,
    transparent: true,
    opacity: 0.4
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
        {/* Body - Rounder and cuter */}
        <Sphere args={[0.75, 64, 64]} scale={[1, 1.05, 1]}>
          <primitive object={featherMaterial} />
        </Sphere>

        {/* Comb (Red thing on top) - Simplified cute version */}
        <group position={[0, 0.72, 0]}>
          <Sphere args={[0.12, 32, 32]} position={[0, 0, 0.1]} scale={[0.8, 1, 1]}>
            <primitive object={combMaterial} />
          </Sphere>
          <Sphere args={[0.15, 32, 32]} position={[0, 0.05, 0]}>
            <primitive object={combMaterial} />
          </Sphere>
          <Sphere args={[0.1, 32, 32]} position={[0, -0.02, -0.15]} scale={[0.8, 1, 1]}>
            <primitive object={combMaterial} />
          </Sphere>
        </group>

        {/* Eyes - Larger and sparkly */}
        <Sphere args={[0.07, 32, 32]} position={[0.22, 0.15, 0.6]}>
          <primitive object={eyeMaterial} />
        </Sphere>
        <Sphere args={[0.07, 32, 32]} position={[-0.22, 0.15, 0.6]}>
          <primitive object={eyeMaterial} />
        </Sphere>
        {/* Eye Highlights */}
        <Sphere args={[0.02, 32, 32]} position={[0.25, 0.18, 0.65]} material={new THREE.MeshBasicMaterial({ color: 'white' })} />
        <Sphere args={[0.02, 32, 32]} position={[-0.19, 0.18, 0.65]} material={new THREE.MeshBasicMaterial({ color: 'white' })} />

        {/* Blush */}
        <Sphere args={[0.12, 32, 32]} position={[0.3, 0.05, 0.55]} scale={[1, 0.6, 0.2]}>
          <primitive object={blushMaterial} />
        </Sphere>
        <Sphere args={[0.12, 32, 32]} position={[-0.3, 0.05, 0.55]} scale={[1, 0.6, 0.2]}>
          <primitive object={blushMaterial} />
        </Sphere>

        {/* Beak - Cute triangle */}
        <Cone args={[0.08, 0.15, 32]} position={[0, 0.05, 0.72]} rotation={[1.57, 0, 0]}>
          <primitive object={beakMaterial} />
        </Cone>

        {/* Wings - Fluffier */}
        <group ref={wingsRef}>
          <group position={[0.65, -0.1, 0]} rotation={[0, 0, -0.3]}>
             <Sphere args={[0.35, 32, 32]} scale={[0.4, 1, 0.8]}>
               <primitive object={featherMaterial} />
             </Sphere>
          </group>
          <group position={[-0.65, -0.1, 0]} rotation={[0, 0, 0.3]}>
             <Sphere args={[0.35, 32, 32]} scale={[0.4, 1, 0.8]}>
               <primitive object={featherMaterial} />
             </Sphere>
          </group>
        </group>

        {/* Feet - Stubby and cute */}
        <group position={[0, -0.7, 0]}>
           <Cylinder args={[0.03, 0.03, 0.15]} position={[0.2, 0, 0]} material={beakMaterial} />
           <Cylinder args={[0.03, 0.03, 0.15]} position={[-0.2, 0, 0]} material={beakMaterial} />
           {/* Toes */}
           <Cone args={[0.05, 0.1, 8]} position={[0.2, -0.08, 0.08]} rotation={[0.5, 0, 0]} material={beakMaterial} />
           <Cone args={[0.05, 0.1, 8]} position={[-0.2, -0.08, 0.08]} rotation={[0.5, 0, 0]} material={beakMaterial} />
        </group>

        {/* Chat Bubble - Fixed for desktop */}
        <Html 
          position={[isMobile ? 0.45 : 0.5, isMobile ? 0.3 : 0.4, 0]} 
          center 
          className="pointer-events-none w-48 sm:w-64 md:w-72" 
          style={{ transform: 'scale(1)', zIndex: 10 }}
          zIndexRange={[10, 0]}
        >
          <div className="bg-white/95 backdrop-blur-sm px-4 py-3 md:px-6 md:py-5 rounded-2xl rounded-tl-none shadow-xl border border-orange-100 relative animate-in zoom-in duration-300 origin-top-left flex items-center min-h-[50px] md:min-h-[60px]">
            <div className="text-amber-900/90 text-xs md:text-sm font-medium leading-relaxed text-left break-words whitespace-pre-wrap w-full">
              {message}
            </div>
            {/* Arrow */}
            <div className="absolute top-3 md:top-4 -left-2 w-0 h-0 border-t-[6px] md:border-t-[8px] border-t-transparent border-r-[8px] md:border-r-[10px] border-r-white/95 border-b-[6px] md:border-b-[8px] border-b-transparent transform rotate-0" style={{ filter: 'drop-shadow(-1px 0px 1px rgba(0,0,0,0.05))' }}></div>
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