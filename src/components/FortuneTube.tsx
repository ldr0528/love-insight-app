import { useEffect, useState, useRef, useMemo } from 'react';
import { Sparkles, X } from 'lucide-react';
import DailyCheckIn from '@/components/DailyCheckIn';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Cylinder, Environment, ContactShadows, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// 竹签组件
function Stick({ position, rotation, isChosen, shaking }: { position: [number, number, number], rotation: [number, number, number], isChosen: boolean, shaking: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const initialY = position[1];
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // 抽签动画：向上移动
    const targetY = isChosen ? initialY + 1.5 : initialY;
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, delta * 8);

    // 摇晃时的随机微动
    if (shaking) {
      ref.current.rotation.z = rotation[2] + (Math.random() - 0.5) * 0.2;
      ref.current.rotation.x = rotation[0] + (Math.random() - 0.5) * 0.1;
    } else {
        ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, rotation[2], delta * 5);
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, rotation[0], delta * 5);
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        {/* 竹签稍微细一点 */}
        <boxGeometry args={[0.08, 2.6, 0.02]} />
        <meshStandardMaterial color="#B08D55" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* 签头红色标记 */}
      <mesh position={[0, 1.1, 0]}>
         <boxGeometry args={[0.08, 0.2, 0.025]} />
         <meshStandardMaterial color="#D93025" roughness={0.3} />
      </mesh>
      {/* 签文文字模拟 (简单的纹理效果) */}
       <mesh position={[0, 0.2, 0.011]}>
         <planeGeometry args={[0.05, 1.2]} />
         <meshBasicMaterial color="#333" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

// 签筒 3D 模型
function TubeModel({ shaking, stickUp, onDraw }: { shaking: boolean, stickUp: boolean, onDraw: () => void }) {
  const group = useRef<THREE.Group>(null);

  // 生成随机竹签位置 - 增加数量，调整位置确保露出
  const sticks = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const angle = (Math.random() * Math.PI * 2);
      const radius = Math.random() * 0.45; // 收紧半径，防止穿模
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      // 提高基础高度，让签露出来更多 (因为筒变矮了，这个高度相对就更高了)
      const y = -0.2 + (Math.random() - 0.5) * 0.3; 
      const rotY = Math.random() * Math.PI;
      const rotZ = (Math.random() - 0.5) * 0.15; // 增加倾斜随机性
      const rotX = (Math.random() - 0.5) * 0.15;
      return { position: [x, y, z] as [number, number, number], rotation: [rotX, rotY, rotZ] as [number, number, number] };
    });
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    if (shaking) {
      // 整体摇晃动画
      const time = state.clock.elapsedTime;
      group.current.rotation.z = Math.sin(time * 15) * 0.15;
      group.current.position.y = Math.sin(time * 20) * 0.05;
      group.current.rotation.x = Math.cos(time * 12) * 0.05;
    } else {
      // 复位
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, 0.1);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, 0.1);
    }
  });

  // 材质 - 使用 useMemo 避免重复创建
  const woodMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#5c3a21', // 更深、更高级的黑胡桃木色
    roughness: 0.4,
    metalness: 0.1,
    clearcoat: 0.3, // 降低清漆感，更自然
    clearcoatRoughness: 0.4,
  }), []);
  
  const bandMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#C41E3A', // 中国红
    roughness: 0.3,
    metalness: 0.3,
    clearcoat: 0.8,
    emissive: '#500000',
    emissiveIntensity: 0.2
  }), []);

  return (
    // 整体缩放 0.7 倍，显得更小巧
    <group ref={group} onClick={(e) => { e.stopPropagation(); onDraw(); }} scale={[0.7, 0.7, 0.7]}>
      {/* 筒身 - 变矮 */}
      <Cylinder args={[0.7, 0.65, 2.0, 64, 1, true]} position={[0, -0.6, 0]} material={woodMaterial} />
      
      {/* 筒内壁 */}
      <Cylinder args={[0.6, 0.6, 2.0, 64, 1, true]} position={[0, -0.6, 0]}>
         <meshStandardMaterial color="#3d2616" roughness={0.9} side={THREE.BackSide} />
      </Cylinder>

      {/* 筒底 */}
      <Cylinder args={[0.65, 0.65, 0.1, 64]} position={[0, -1.55, 0]} material={woodMaterial} />

      {/* 顶部边缘 - 加一点倒角感 */}
      <Cylinder args={[0.75, 0.7, 0.15, 64]} position={[0, 0.35, 0]} material={woodMaterial} />

      {/* 竹签集合 */}
      {sticks.map((props, i) => (
        <Stick 
          key={i} 
          {...props} 
          isChosen={stickUp && i === 5} // 假设第6根是“幸运签”被抽中
          shaking={shaking} 
        />
      ))}
    </group>
  );
}

export default function FortuneTube() {
  const [drawing, setDrawing] = useState(false);
  const [stickUp, setStickUp] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleDraw = () => {
    if (drawing) return;
    setDrawing(true);
    setShaking(true);
    
    // 摇晃一段时间后出签
    setTimeout(() => {
        setShaking(false);
        setStickUp(true);
    }, 1500);

    // 出签展示一会后弹出结果
    setTimeout(() => {
      setStickUp(false);
      setDrawing(false);
      setShowModal(true);
    }, 2500);
  };

  useEffect(() => {
    const onMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const magnitude = Math.sqrt(
        Math.pow(acc.x || 0, 2) + Math.pow(acc.y || 0, 2) + Math.pow(acc.z || 0, 2)
      );
      if (magnitude > 18) {
        handleDraw();
      }
    };
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', onMotion);
    }
    return () => window.removeEventListener('devicemotion', onMotion);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 3D 场景容器 */}
      <div className="w-64 h-80 cursor-pointer relative" onClick={handleDraw}>
        <Canvas camera={{ position: [0, 2, 5.5], fov: 35 }} shadows>
          <ambientLight intensity={0.7} />
          <spotLight position={[5, 8, 5]} angle={0.4} penumbra={0.5} intensity={1.2} castShadow />
          <pointLight position={[-3, 2, -3]} color="#ffecd2" intensity={0.5} />
          
          <TubeModel shaking={shaking} stickUp={stickUp} onDraw={handleDraw} />
          
          <Environment preset="studio" />
          <ContactShadows position={[0, -2.2, 0]} opacity={0.4} scale={8} blur={2.5} far={4} color="#000000" />
        </Canvas>
      </div>

      <button
        onClick={handleDraw}
        disabled={drawing}
        className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed z-10"
      >
        {drawing ? (shaking ? "摇签中..." : "解签中...") : "抽取今日运势"} <Sparkles className="w-5 h-5" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <button
            aria-label="关闭"
            onClick={(e) => { e.stopPropagation(); setShowModal(false); }}
            className="absolute right-6 top-6 md:right-8 md:top-8 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg border border-gray-200 text-gray-700 hover:bg-pink-50 hover:text-pink-600 flex items-center justify-center z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl ring-1 ring-gray-100" onClick={(e) => e.stopPropagation()}>
            <div className="p-2 md:p-4">
              <DailyCheckIn />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
