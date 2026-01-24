import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cone, Cylinder, Float, ContactShadows, useCursor, Html } from '@react-three/drei';
import * as THREE from 'three';

function CatModel({ hovered, setHovered, message }: { hovered: boolean, setHovered: (h: boolean) => void, message: React.ReactNode }) {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  // Materials - Enhanced for realism
  const greyFur = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#9a9a9a', 
    roughness: 1, 
    metalness: 0.1,
  }), []);
  
  const darkGreyFur = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#606060', 
    roughness: 1, 
    metalness: 0.1
  }), []);

  const pinkSkin = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#ffb7b2', 
    roughness: 0.5,
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
    color: '#ff8a80', 
    roughness: 0.4,
    metalness: 0.1
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
    
    // Head bobbing and following mouse slightly
    headRef.current.position.y = 0.6 + Math.sin(time * 2) * 0.02;
    
    // Mouse interaction for head rotation
    const mouseX = state.mouse.x * 0.5;
    const mouseY = state.mouse.y * 0.5;
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouseX, 0.1);
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouseY * 0.5, 0.1);

    // Tail wagging
    tailRef.current.rotation.z = Math.sin(time * 5) * 0.2;
    tailRef.current.rotation.y = Math.cos(time * 3) * 0.2;
    
    // Body breathing
    if (bodyRef.current) {
        bodyRef.current.scale.x = 1 + Math.sin(time * 3) * 0.02;
        bodyRef.current.scale.z = 1 + Math.sin(time * 3) * 0.02;
    }
  });

  return (
    <group 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      scale={[isMobile ? 0.75 : 1.0, isMobile ? 0.75 : 1.0, isMobile ? 0.75 : 1.0]} // Scale down on mobile
      position={[isMobile ? -0.3 : 0, -0.6, 0]}
    >
      {/* Body - Slightly adjusted shape for cuteness */}
      <group ref={bodyRef} position={[0, 0, 0]}>
        <Sphere args={[0.7, 64, 64]} position={[0, 0, 0]} scale={[1, 0.95, 0.95]}>
          <primitive object={greyFur} />
        </Sphere>
        {/* Belly Patch */}
        <Sphere args={[0.6, 64, 64]} position={[0, 0, 0.15]} scale={[0.8, 0.85, 0.85]}>
          <meshStandardMaterial color="#c0c0c0" roughness={1} />
        </Sphere>
      </group>

      {/* Head Group */}
      <group ref={headRef} position={[0, 0.65, 0.1]}>
        {/* Main Head */}
        <Sphere args={[0.55, 64, 64]} scale={[1, 0.9, 0.9]}>
           <primitive object={greyFur} />
        </Sphere>

        {/* Ears - Cat shape but with soft rounded tips (Truncated Cones) */}
        <group position={[0.35, 0.45, 0]} rotation={[0, 0, -0.2]}>
          {/* Outer Ear */}
          <mesh>
             <cylinderGeometry args={[0.03, 0.18, 0.35, 64]} />
             <primitive object={greyFur} />
          </mesh>
          {/* Inner Ear */}
          <mesh position={[0, -0.02, 0.08]}>
             <cylinderGeometry args={[0.02, 0.12, 0.25, 64]} />
             <primitive object={pinkSkin} />
          </mesh>
        </group>
        <group position={[-0.35, 0.45, 0]} rotation={[0, 0, 0.2]}>
           {/* Outer Ear */}
           <mesh>
             <cylinderGeometry args={[0.03, 0.18, 0.35, 64]} />
             <primitive object={greyFur} />
           </mesh>
           {/* Inner Ear */}
           <mesh position={[0, -0.02, 0.08]}>
             <cylinderGeometry args={[0.02, 0.12, 0.25, 64]} />
             <primitive object={pinkSkin} />
           </mesh>
        </group>

        {/* Eyes - Deep and shiny */}
        <Sphere args={[0.07, 64, 64]} position={[0.2, 0.05, 0.42]}>
          <primitive object={eyeMaterial} />
        </Sphere>
        <Sphere args={[0.07, 64, 64]} position={[-0.2, 0.05, 0.42]}>
          <primitive object={eyeMaterial} />
        </Sphere>
        {/* Eye Highlights */}
        <Sphere args={[0.025, 32, 32]} position={[0.23, 0.09, 0.47]} material={new THREE.MeshBasicMaterial({ color: 'white' })} />
        <Sphere args={[0.025, 32, 32]} position={[-0.17, 0.09, 0.47]} material={new THREE.MeshBasicMaterial({ color: 'white' })} />

        {/* Nose - Rounded triangle */}
        <Sphere args={[0.035, 32, 32]} position={[0, -0.05, 0.5]} scale={[1, 0.7, 0.5]}>
          <primitive object={noseMaterial} />
        </Sphere>

        {/* Cheeks - Softer blush */}
        <Sphere args={[0.12, 32, 32]} position={[0.3, -0.05, 0.35]} scale={[1, 0.6, 0.5]}>
             <meshStandardMaterial color="#ffb7b2" transparent opacity={0.3} roughness={1} />
        </Sphere>
        <Sphere args={[0.12, 32, 32]} position={[-0.3, -0.05, 0.35]} scale={[1, 0.6, 0.5]}>
             <meshStandardMaterial color="#ffb7b2" transparent opacity={0.3} roughness={1} />
        </Sphere>

        {/* Chat Bubble attached to mouth area */}
        <Html 
          position={[isMobile ? 0.5 : 0.6, isMobile ? 0.25 : 0.35, 0]} 
          center 
          className="pointer-events-none w-48 sm:w-72 md:w-80" 
          style={{ transform: 'scale(1)', zIndex: 10 }}
          zIndexRange={[10, 0]}
        >
          <div className="bg-white/95 backdrop-blur-sm px-4 py-3 md:px-6 md:py-5 rounded-2xl rounded-tl-none shadow-xl border border-orange-100 relative animate-in zoom-in duration-300 origin-top-left flex items-center min-h-[50px] md:min-h-[60px]">
            <div className="text-amber-900/90 text-xs md:text-sm font-medium leading-relaxed text-left break-words whitespace-pre-wrap w-full">
              {message}
            </div>
            {/* Arrow pointing to mouth */}
            <div className="absolute top-3 md:top-4 -left-2 w-0 h-0 border-t-[6px] md:border-t-[8px] border-t-transparent border-r-[8px] md:border-r-[10px] border-r-white/95 border-b-[6px] md:border-b-[8px] border-b-transparent transform rotate-0" style={{ filter: 'drop-shadow(-1px 0px 1px rgba(0,0,0,0.05))' }}></div>
          </div>
        </Html>
      </group>

      {/* Tail */}
      <group ref={tailRef} position={[0, -0.2, -0.6]}>
        <mesh position={[0, 0.3, 0]} rotation={[0.5, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.7, 4, 8]} />
          <primitive object={greyFur} />
        </mesh>
      </group>

      {/* Paws */}
      <Sphere args={[0.18, 32, 32]} position={[0.3, -0.6, 0.4]} scale={[1, 0.7, 1]}>
        <primitive object={darkGreyFur} />
      </Sphere>
      <Sphere args={[0.18, 32, 32]} position={[-0.3, -0.6, 0.4]} scale={[1, 0.7, 1]}>
        <primitive object={darkGreyFur} />
      </Sphere>
    </group>
  );
}

export default function ThreeCat({ message }: { message?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <div className="w-full h-96 relative -mt-8 -mb-12"> {/* Increased height and negative margins to allow overflow */}
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <ambientLight intensity={0.7} />
        <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={0.8} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffb7b2" />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
          <CatModel hovered={hovered} setHovered={setHovered} message={message} />
        </Float>
        
        <ContactShadows position={[0, -1.4, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#e6a57e" />
      </Canvas>
    </div>
  );
}
