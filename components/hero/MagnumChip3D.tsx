"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const BASE_ROTATION = new THREE.Euler(0.1, -0.14, -0.1);
const TOTAL_TOSS_DURATION = 1.35;

type MagnumChip3DProps = {
  onReady?: () => void;
};

function easeInOutPower2(value: number) {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

function ChipModel({ onReady }: MagnumChip3DProps) {
  const { scene } = useGLTF("/models/magnum-chip.glb");
  const chipGroupRef = useRef<THREE.Group>(null);
  const isAnimatingRef = useRef(false);
  const animationStartRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const hasPaintedRef = useRef(false);
  const { invalidate } = useThree();

  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;
    });
  }, [model]);
  useFrame((_, delta) => {
    const chip = chipGroupRef.current;
    if (!chip) return;

    if (!hasPaintedRef.current) {
      hasPaintedRef.current = true;
      onReady?.();
    }

    if (isAnimatingRef.current) {
      const elapsed = (performance.now() - animationStartRef.current) / 1000;

      if (elapsed <= 0.15) {
        const progress = elapsed / 0.15;
        const release = 1 - Math.pow(1 - progress, 2);
        chip.position.y = 0.08 * release;
        chip.rotation.z = BASE_ROTATION.z - 0.06 * release;
      } else if (elapsed <= 0.9) {
        const progress = (elapsed - 0.15) / 0.75;
        const spin = easeInOutPower2(progress);
        chip.position.y = 0.08 + Math.sin(progress * Math.PI) * 0.2 + progress * 0.04;
        chip.rotation.x = BASE_ROTATION.x - Math.PI * 2.6 * spin;
        chip.rotation.y = BASE_ROTATION.y + Math.sin(progress * Math.PI) * 0.12;
        chip.rotation.z = BASE_ROTATION.z - Math.PI * 0.25 * spin;
      } else if (elapsed <= TOTAL_TOSS_DURATION) {
        const progress = (elapsed - 0.9) / 0.45;
        const settle = 1 - Math.pow(1 - progress, 4);
        chip.position.y = THREE.MathUtils.lerp(0.12, 0, settle);
        chip.rotation.x = THREE.MathUtils.lerp(BASE_ROTATION.x - Math.PI * 2.6, BASE_ROTATION.x, settle);
        chip.rotation.y = THREE.MathUtils.lerp(BASE_ROTATION.y, BASE_ROTATION.y, settle);
        chip.rotation.z = THREE.MathUtils.lerp(BASE_ROTATION.z - Math.PI * 0.25, BASE_ROTATION.z - 0.02, settle);
      } else {
        chip.position.y = 0;
        chip.rotation.copy(BASE_ROTATION);
        isAnimatingRef.current = false;
      }

      invalidate();
      return;
    }

    chip.rotation.x = THREE.MathUtils.damp(chip.rotation.x, BASE_ROTATION.x + pointerRef.current.y * 0.03, 8, delta);
    chip.rotation.y = THREE.MathUtils.damp(chip.rotation.y, BASE_ROTATION.y + pointerRef.current.x * 0.05, 8, delta);
    chip.rotation.z = THREE.MathUtils.damp(chip.rotation.z, BASE_ROTATION.z, 8, delta);
    chip.position.y = THREE.MathUtils.damp(chip.position.y, 0, 8, delta);
  });

  return (
    <group
      ref={chipGroupRef}
      rotation={BASE_ROTATION}
      onPointerMove={(event) => {
        if (isAnimatingRef.current) return;
        pointerRef.current.x = event.pointer.x;
        pointerRef.current.y = event.pointer.y;
        invalidate();
      }}
      onPointerOut={() => {
        if (isAnimatingRef.current) return;
        pointerRef.current.x = 0;
        pointerRef.current.y = 0;
        invalidate();
      }}
      onClick={() => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        animationStartRef.current = performance.now();
        invalidate();
      }}
    >
      <group rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={model} dispose={null} />
      </group>
    </group>
  );
}

export default function MagnumChip3D({ onReady }: MagnumChip3DProps = {}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="always"
      camera={{ fov: 32, position: [0, 0.05, 4.1] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      style={{ background: "transparent", cursor: "pointer" }}
    >
      <ambientLight intensity={0.42} color="#F1EFE9" />
      <directionalLight position={[-3, 4, 5]} intensity={2.8} color="#FFF2DF" />
      <directionalLight position={[3, 1, 3]} intensity={0.45} color="#F1EFE9" />
      <pointLight position={[2, 1, -3]} intensity={1.1} color="#C4A36A" />
      <Environment preset="studio" environmentIntensity={0.22} />
      <Suspense fallback={null}>
        <ChipModel onReady={onReady} />
      </Suspense>
      <ContactShadows position={[0, -1.05, 0]} opacity={0.3} scale={3.4} blur={3.2} far={1.8} color="#08090B" />
    </Canvas>
  );
}

useGLTF.preload("/models/magnum-chip.glb");