import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cone, Cylinder, Float, ContactShadows, useCursor, Html } from '@react-three/drei';
import * as THREE from 'three';

function CatModel({ hovered, setHovered, message }: { hovered: boolean, setHovered: (h: boolean) => void, message: React.ReactNode }) {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  // Materials
  const whiteFur = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6, metalness: 0.1 }), []);
  const pinkSkin = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffb7b2', roughness: 0.5 }), []);
  const darkEye = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.2, metalness: 0.5 }), []);
  const cheekColor = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffcfcc', transparent: true, opacity: 0.6 }), []);

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
      scale={[1.3, 1.3, 1.3]} // Increased scale
      position={[0, -0.6, 0]}
    >
      {/* Body */}
      <group ref={bodyRef} position={[0, 0, 0]}>
        <Sphere args={[0.7, 32, 32]} position={[0, 0, 0]} scale={[1, 0.85, 0.9]}>
          <primitive object={whiteFur} />
        </Sphere>
      </group>

      {/* Head Group */}
      <group ref={headRef} position={[0, 0.6, 0.2]}>
        {/* Main Head */}
        <Sphere args={[0.55, 32, 32]} scale={[1, 0.9, 0.9]}>
           <primitive object={whiteFur} />
        </Sphere>

        {/* Ears */}
        <group position={[0.35, 0.45, 0]} rotation={[0, 0, -0.4]}>
          <Cone args={[0.15, 0.3, 32]} material={whiteFur} />
          <Cone args={[0.1, 0.2, 32]} position={[0, -0.02, 0.06]} material={pinkSkin} />
        </group>
        <group position={[-0.35, 0.45, 0]} rotation={[0, 0, 0.4]}>
          <Cone args={[0.15, 0.3, 32]} material={whiteFur} />
          <Cone args={[0.1, 0.2, 32]} position={[0, -0.02, 0.06]} material={pinkSkin} />
        </group>

        {/* Eyes */}
        <Sphere args={[0.06, 16, 16]} position={[0.18, 0.05, 0.45]}>
          <primitive object={darkEye} />
        </Sphere>
        <Sphere args={[0.06, 16, 16]} position={[-0.18, 0.05, 0.45]}>
          <primitive object={darkEye} />
        </Sphere>
        {/* Eye Highlights */}
        <Sphere args={[0.02, 8, 8]} position={[0.2, 0.08, 0.5]} material={new THREE.MeshBasicMaterial({ color: 'white' })} />
        <Sphere args={[0.02, 8, 8]} position={[-0.16, 0.08, 0.5]} material={new THREE.MeshBasicMaterial({ color: 'white' })} />

        {/* Nose */}
        <Sphere args={[0.03, 16, 16]} position={[0, -0.05, 0.5]} material={pinkSkin} scale={[1, 0.6, 0.5]} />

        {/* Mouth (Two small spheres/cylinders) */}
        <group position={[0, -0.12, 0.48]} rotation={[0, 0, 0]}>
             <Cylinder args={[0.015, 0.015, 0.1, 8]} rotation={[0, 0, Math.PI / 2]} material={darkEye} position={[0.03, 0, 0]} />
             <Cylinder args={[0.015, 0.015, 0.1, 8]} rotation={[0, 0, Math.PI / 2]} material={darkEye} position={[-0.03, 0, 0]} />
        </group>

        {/* Cheeks */}
        <Sphere args={[0.1, 16, 16]} position={[0.25, -0.05, 0.4]} scale={[1, 0.6, 0.5]}>
             <primitive object={cheekColor} />
        </Sphere>
        <Sphere args={[0.1, 16, 16]} position={[-0.25, -0.05, 0.4]} scale={[1, 0.6, 0.5]}>
             <primitive object={cheekColor} />
        </Sphere>

        {/* Chat Bubble attached to mouth area */}
        <Html position={[0.8, 0.2, 0]} center className="pointer-events-none w-64" style={{ transform: 'scale(1)' }}>
          <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-none shadow-lg border border-orange-100 relative animate-in zoom-in duration-300 origin-top-left">
            <div className="text-amber-900/90 text-xs font-medium leading-relaxed text-left">
              {message}
            </div>
            {/* Arrow pointing to mouth */}
            <div className="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-white/95 border-l-[8px] border-l-transparent border-r-[0px] border-r-transparent transform rotate-0" style={{ filter: 'drop-shadow(-1px 1px 1px rgba(0,0,0,0.05))' }}></div>
          </div>
        </Html>
      </group>

      {/* Tail */}
      <group ref={tailRef} position={[0, -0.2, -0.6]}>
        <mesh position={[0, 0.3, 0]} rotation={[0.5, 0, 0]}>
          <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
          <primitive object={whiteFur} />
        </mesh>
      </group>

      {/* Paws */}
      <Sphere args={[0.15, 16, 16]} position={[0.3, -0.6, 0.4]} scale={[1, 0.7, 1]}>
        <primitive object={whiteFur} />
      </Sphere>
      <Sphere args={[0.15, 16, 16]} position={[-0.3, -0.6, 0.4]} scale={[1, 0.7, 1]}>
        <primitive object={whiteFur} />
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
