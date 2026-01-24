import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Float, ContactShadows, useCursor, Html, Cone } from '@react-three/drei';
import * as THREE from 'three';

function DogModel({ hovered, setHovered, message }: { hovered: boolean, setHovered: (h: boolean) => void, message: React.ReactNode }) {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const portalRef = useRef(document.body);

  // Materials - Improved dog colors to match realistic puppy photo (Cream/Beige)
  const furMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#E8DCC4', // Champagne/Cream color - slightly warmer/lighter
    roughness: 1, 
    metalness: 0
  }), []);
  
  const lightFurMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#ffffff', // White for muzzle, paws, belly
    roughness: 1, 
    metalness: 0
  }), []);

  const eyeMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ 
    color: '#000000', 
    roughness: 0.1, 
    metalness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  }), []);
  
  const noseMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#3e2723', 
    roughness: 0.4,
    metalness: 0.1
  }), []);

  const pinkSkin = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#ffb7b2', 
    roughness: 0.5,
    metalness: 0
  }), []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useFrame((state) => {
    if (!headRef.current || !bodyRef.current || !tailRef.current) return;
    const time = state.clock.elapsedTime;
    
    headRef.current.position.y = 0.7 + Math.sin(time * 2) * 0.02;
    const mouseX = state.mouse.x * 0.5;
    const mouseY = state.mouse.y * 0.5;
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouseX, 0.1);
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouseY * 0.5, 0.1);

    // Tail wagging - faster for dog
    tailRef.current.rotation.z = Math.sin(time * 10) * 0.3;
    tailRef.current.rotation.y = Math.cos(time * 5) * 0.1;
    
    if (bodyRef.current) {
        bodyRef.current.scale.x = 1 + Math.sin(time * 3) * 0.01;
        bodyRef.current.scale.z = 1 + Math.sin(time * 3) * 0.01;
    }
  });

  return (
    <group 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      scale={[isMobile ? 0.75 : 1.0, isMobile ? 0.75 : 1.0, isMobile ? 0.75 : 1.0]}
      position={[isMobile ? -0.3 : 0, -0.6, 0]}
    >
      {/* Body - Adjusted shape */}
      <group ref={bodyRef}>
        {/* Main Body */}
        <Sphere args={[0.7, 64, 64]} scale={[1, 0.95, 1.1]}>
          <primitive object={furMaterial} />
        </Sphere>
        {/* Belly Patch */}
        <Sphere args={[0.6, 64, 64]} position={[0, -0.1, 0.25]} scale={[0.8, 0.9, 0.8]}>
          <primitive object={lightFurMaterial} />
        </Sphere>
      </group>

      {/* Head */}
      <group ref={headRef} position={[0, 0.75, 0.2]}>
        {/* Main Head - More dome-shaped, less sphere */}
        <Sphere args={[0.55, 64, 64]} scale={[1, 1.1, 1.1]}>
           <primitive object={furMaterial} />
        </Sphere>

        {/* Ears - Much longer and floppy (Golden/Spaniel style) */}
        <group position={[0.42, 0.2, 0]} rotation={[0, 0, -0.2]}>
           {/* Base of ear */}
           <Sphere args={[0.15, 32, 32]} position={[0, -0.1, 0]}>
             <primitive object={furMaterial} />
           </Sphere>
           {/* Flap of ear - Drooping down */}
           <mesh position={[0.1, -0.4, 0.1]} rotation={[0, 0, -0.2]} scale={[1, 1, 0.5]}>
             <capsuleGeometry args={[0.15, 0.6, 4, 8]} />
             <primitive object={furMaterial} />
           </mesh>
        </group>
        <group position={[-0.42, 0.2, 0]} rotation={[0, 0, 0.2]}>
           {/* Base of ear */}
           <Sphere args={[0.15, 32, 32]} position={[0, -0.1, 0]}>
             <primitive object={furMaterial} />
           </Sphere>
           {/* Flap of ear - Drooping down */}
           <mesh position={[-0.1, -0.4, 0.1]} rotation={[0, 0, 0.2]} scale={[1, 1, 0.5]}>
             <capsuleGeometry args={[0.15, 0.6, 4, 8]} />
             <primitive object={furMaterial} />
           </mesh>
        </group>

        {/* Eyes - Larger and cuter */}
        <Sphere args={[0.075, 64, 64]} position={[0.2, 0.05, 0.45]}>
          <primitive object={eyeMaterial} />
        </Sphere>
        <Sphere args={[0.075, 64, 64]} position={[-0.2, 0.05, 0.45]}>
          <primitive object={eyeMaterial} />
        </Sphere>
        {/* Eye Highlights */}
        <Sphere args={[0.02, 32, 32]} position={[0.23, 0.08, 0.5]} material={new THREE.MeshBasicMaterial({ color: 'white' })} />
        <Sphere args={[0.02, 32, 32]} position={[-0.17, 0.08, 0.5]} material={new THREE.MeshBasicMaterial({ color: 'white' })} />
        
        {/* Snout - Significantly elongated and distinct */}
        <group position={[0, -0.15, 0.6]}>
          {/* Bridge of nose */}
          <mesh position={[0, 0.1, -0.1]} rotation={[0.2, 0, 0]}>
             <boxGeometry args={[0.25, 0.2, 0.4]} />
             <primitive object={lightFurMaterial} />
          </mesh>
          {/* Muzzle end */}
          <Sphere args={[0.18, 32, 32]} position={[0, 0, 0.1]} scale={[1.2, 0.9, 1]}>
            <primitive object={lightFurMaterial} />
          </Sphere>
          {/* Nose - Triangle shape */}
          <Cone args={[0.07, 0.08, 32]} position={[0, 0.08, 0.25]} rotation={[0.5, 0, 0]} material={new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.4 })} />
        </group>

        {/* Cheeks - Subtle */}
        <Sphere args={[0.12, 32, 32]} position={[0.28, -0.1, 0.35]} scale={[1, 0.6, 0.5]}>
             <meshStandardMaterial color="#ffb7b2" transparent opacity={0.15} roughness={1} />
        </Sphere>
        <Sphere args={[0.12, 32, 32]} position={[-0.28, -0.1, 0.35]} scale={[1, 0.6, 0.5]}>
             <meshStandardMaterial color="#ffb7b2" transparent opacity={0.15} roughness={1} />
        </Sphere>

        {/* Chat Bubble - Portal to body to avoid clipping */}
        <Html 
          portal={portalRef}
          position={[isMobile ? 0.35 : 0.45, isMobile ? 0.25 : 0.35, 0]} 
          center 
          className="pointer-events-none w-max max-w-[200px] sm:max-w-[300px] md:max-w-[350px]" 
          style={{ transform: 'scale(1)', zIndex: 1000 }}
          zIndexRange={[1000, 0]}
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

      {/* Tail - Waggier */}
      <group ref={tailRef} position={[0, -0.2, -0.6]}>
        <mesh position={[0, 0.3, 0]} rotation={[0.5, 0, 0]}>
          <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
          <primitive object={furMaterial} />
        </mesh>
      </group>

      {/* Paws */}
      <Sphere args={[0.2, 32, 32]} position={[0.35, -0.65, 0.4]} scale={[1, 0.7, 1.2]}>
        <primitive object={lightFurMaterial} />
      </Sphere>
      <Sphere args={[0.2, 32, 32]} position={[-0.35, -0.65, 0.4]} scale={[1, 0.7, 1.2]}>
        <primitive object={lightFurMaterial} />
      </Sphere>
    </group>
  );
}

export default function ThreeDog({ message }: { message?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <div className="w-full h-96 relative -mt-8 -mb-12">
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={0.8} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#F4A460" />
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
          <DogModel hovered={hovered} setHovered={setHovered} message={message} />
        </Float>
        <ContactShadows position={[0, -1.4, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#8B4513" />
      </Canvas>
    </div>
  );
}