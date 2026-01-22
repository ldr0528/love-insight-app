import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cone, Cylinder, Float, ContactShadows, useCursor, Html } from '@react-three/drei';
import * as THREE from 'three';

function CatModel({ hovered, setHovered, message }: { hovered: boolean, setHovered: (h: boolean) => void, message: React.ReactNode }) {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  // Materials
  const greyFur = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#999999', 
    roughness: 0.8, 
    metalness: 0.05 
  }), []);
  
  const darkGreyFur = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#777777', 
    roughness: 0.8, 
    metalness: 0.05 
  }), []);

  const pinkSkin = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#d4888d', 
    roughness: 0.6 
  }), []);
  
  const darkEye = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#000000', 
    roughness: 0.1, 
    metalness: 0.8 
  }), []);
  
  const cheekColor = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#d4888d', 
    transparent: true, 
    opacity: 0.4 
  }), []);

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
      scale={[1.1, 1.1, 1.1]} // Slightly smaller scale for realism
      position={[0, -0.6, 0]}
    >
      {/* Body */}
      <group ref={bodyRef} position={[0, 0, 0]}>
        <Sphere args={[0.7, 32, 32]} position={[0, 0, 0]} scale={[1, 0.9, 0.9]}>
          <primitive object={greyFur} />
        </Sphere>
      </group>

      {/* Head Group */}
      <group ref={headRef} position={[0, 0.65, 0.1]}>
        {/* Main Head */}
        <Sphere args={[0.55, 32, 32]} scale={[1, 0.9, 0.9]}>
           <primitive object={greyFur} />
        </Sphere>

        {/* Ears - More realistic shape */}
        <group position={[0.35, 0.45, 0]} rotation={[0, 0, -0.2]}>
          <Cone args={[0.18, 0.35, 32]} material={greyFur} />
          <Cone args={[0.12, 0.25, 32]} position={[0, -0.02, 0.06]} material={pinkSkin} />
        </group>
        <group position={[-0.35, 0.45, 0]} rotation={[0, 0, 0.2]}>
          <Cone args={[0.18, 0.35, 32]} material={greyFur} />
          <Cone args={[0.12, 0.25, 32]} position={[0, -0.02, 0.06]} material={pinkSkin} />
        </group>

        {/* Eyes - Larger and shinier */}
        <Sphere args={[0.07, 32, 32]} position={[0.2, 0.05, 0.42]}>
          <primitive object={darkEye} />
        </Sphere>
        <Sphere args={[0.07, 32, 32]} position={[-0.2, 0.05, 0.42]}>
          <primitive object={darkEye} />
        </Sphere>
        {/* Eye Highlights */}
        <Sphere args={[0.025, 16, 16]} position={[0.22, 0.08, 0.48]} material={new THREE.MeshBasicMaterial({ color: 'white' })} />
        <Sphere args={[0.025, 16, 16]} position={[-0.18, 0.08, 0.48]} material={new THREE.MeshBasicMaterial({ color: 'white' })} />

        {/* Nose - Small and cute */}
        <Sphere args={[0.03, 16, 16]} position={[0, -0.05, 0.5]} material={pinkSkin} scale={[1, 0.6, 0.5]} />

        {/* Mouth - Simple line */}
        <mesh position={[0, -0.12, 0.48]} rotation={[0, 0, 0]}>
           <boxGeometry args={[0.1, 0.02, 0.02]} />
           <meshStandardMaterial color="#333" />
        </mesh>

        {/* Cheeks - Subtle blush */}
        <Sphere args={[0.12, 16, 16]} position={[0.3, -0.05, 0.35]} scale={[1, 0.6, 0.5]}>
             <primitive object={cheekColor} />
        </Sphere>
        <Sphere args={[0.12, 16, 16]} position={[-0.3, -0.05, 0.35]} scale={[1, 0.6, 0.5]}>
             <primitive object={cheekColor} />
        </Sphere>

        {/* Chat Bubble attached to mouth area */}
        <Html 
          position={[0.7, 0.3, 0]} 
          center 
          className="pointer-events-none w-64 md:w-72" 
          style={{ transform: 'scale(1)', zIndex: 0 }}
          zIndexRange={[0, 0]}
        >
          <div className="bg-white/95 backdrop-blur-sm px-4 py-3 md:px-5 md:py-4 rounded-2xl rounded-tl-none shadow-xl border border-orange-100 relative animate-in zoom-in duration-300 origin-top-left flex items-center min-h-[60px]">
            <div className="text-amber-900/90 text-xs md:text-sm font-medium leading-relaxed text-left break-words whitespace-pre-wrap w-full">
              {message}
            </div>
            {/* Arrow pointing to mouth */}
            <div className="absolute top-4 -left-2 w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-white/95 border-b-[8px] border-b-transparent transform rotate-0" style={{ filter: 'drop-shadow(-1px 0px 1px rgba(0,0,0,0.05))' }}></div>
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
    <div className="w-full h-80 relative"> {/* Increased container size */}
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 35 }} dpr={[1, 2]}>
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
