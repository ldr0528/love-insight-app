import { useEffect, useState, useRef, useMemo } from 'react';
import { Sparkles, X } from 'lucide-react';
import DailyCheckIn from '@/components/DailyCheckIn';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Cylinder, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

// 竹签组件
function Stick({ position, rotation, isChosen, shaking }: { position: [number, number, number], rotation: [number, number, number], isChosen: boolean, shaking: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const initialY = position[1];
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // 抽签动画：向上移动
    const targetY = isChosen ? initialY + 1.2 : initialY;
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, delta * 8);

    // 摇晃时的随机微动
    if (shaking) {
      ref.current.rotation.z = rotation[2] + (Math.random() - 0.5) * 0.1;
    } else {
        ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, rotation[2], delta * 5);
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.12, 2.8, 0.03]} />
        <meshStandardMaterial color="#C48136" roughness={0.6} />
      </mesh>
      {/* 签头红色标记 */}
      <mesh position={[0, 1.2, 0]}>
         <boxGeometry args={[0.12, 0.2, 0.035]} />
         <meshStandardMaterial color="#8B2A2A" />
      </mesh>
    </group>
  );
}

// 签筒 3D 模型
function TubeModel({ shaking, stickUp, onDraw }: { shaking: boolean, stickUp: boolean, onDraw: () => void }) {
  const group = useRef<THREE.Group>(null);

  // 生成随机竹签位置
  const sticks = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const angle = (Math.random() * Math.PI * 2);
      const radius = Math.random() * 0.6; // 在筒内随机分布
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -0.5 + (Math.random() - 0.5) * 0.2;
      const rotY = Math.random() * Math.PI;
      const rotZ = (Math.random() - 0.5) * 0.1; // 稍微倾斜
      return { position: [x, y, z] as [number, number, number], rotation: [0, rotY, rotZ] as [number, number, number] };
    });
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    if (shaking) {
      // 整体摇晃动画
      const time = state.clock.elapsedTime;
      group.current.rotation.z = Math.sin(time * 15) * 0.15;
      group.current.position.y = Math.sin(time * 20) * 0.05;
    } else {
      // 复位
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, 0.1);
    }
  });

  return (
    <group ref={group} onClick={(e) => { e.stopPropagation(); onDraw(); }}>
      {/* 筒身 (空心圆柱效果，用一个管子) */}
      <Cylinder args={[1.0, 0.9, 3.2, 32, 1, true]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#E6C07A" side={THREE.DoubleSide} roughness={0.4} metalness={0.2} />
      </Cylinder>
      
      {/* 筒底 */}
      <Cylinder args={[0.9, 0.9, 0.1, 32]} position={[0, -2.1, 0]}>
        <meshStandardMaterial color="#C9A05A" />
      </Cylinder>

      {/* 装饰环 (红色) */}
      <Cylinder args={[1.01, 1.01, 0.3, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#B84A3C" roughness={0.3} />
      </Cylinder>
      
      {/* 装饰环 (底部) */}
      <Cylinder args={[0.95, 0.95, 0.2, 32]} position={[0, -1.8, 0]}>
        <meshStandardMaterial color="#B84A3C" roughness={0.3} />
      </Cylinder>

      {/* "签筒" 文字贴图 - 使用 Html 以支持中文字符 */}
      <Html
        position={[0, 0, 1.02]} // 放在筒壁前方
        transform
        occlude
        style={{
          width: '60px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        <div className="text-[#5c3a1e] text-lg font-extrabold whitespace-nowrap" style={{ fontFamily: 'serif' }}>
          签筒
        </div>
      </Html>

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
      <div className="w-48 h-64 cursor-pointer relative" onClick={handleDraw}>
        <Canvas camera={{ position: [0, 1, 6], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[-5, 5, -5]} color="#ffecd2" intensity={1} />
          
          <TubeModel shaking={shaking} stickUp={stickUp} onDraw={handleDraw} />
          
          <Environment preset="sunset" />
          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        </Canvas>
        
        {/* 提示遮罩，避免 Canvas 拦截所有点击导致不好触发（Canvas 内部已处理 onClick，但加一层保障也可以，这里先不加） */}
      </div>

      <button
        onClick={handleDraw}
        disabled={drawing}
        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
