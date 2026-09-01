"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Approved hero pose from the Blender "MAGNUM Hero Chip Turntable" scene.
 * The chip faces the text on the left. Do not change without a new visual reference.
 */
const BASE_ROTATION = new THREE.Euler(0.7, -0.42, -0.04);
const NORMALIZED_DIAMETER = 1.82;
const FLIP_DURATION = 1.2;

type MagnumChip3DProps = {
  onReady?: () => void;
  onError?: (error: Error) => void;
};

type ChipSceneErrorBoundaryProps = {
  children: ReactNode;
  onError?: (error: Error) => void;
};

type ChipSceneErrorBoundaryState = {
  hasError: boolean;
};

export class ChipSceneErrorBoundary extends Component<
  ChipSceneErrorBoundaryProps,
  ChipSceneErrorBoundaryState
> {
  state: ChipSceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ChipSceneErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[MAGNUM chip] 3D scene failed", error, errorInfo);
    }
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function ChipModel({ onReady }: MagnumChip3DProps) {
  const { scene } = useGLTF("/models/magnum-chip.glb");
  const chipGroupRef = useRef<THREE.Group>(null);
  const isAnimatingRef = useRef(false);
  const animationStartRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const hasPaintedRef = useRef(false);
  const { invalidate } = useThree();

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clone);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const diameter = Math.max(size.x, size.y, size.z);

    clone.position.sub(center);
    clone.scale.setScalar(NORMALIZED_DIAMETER / diameter);
    clone.updateMatrixWorld(true);

    return clone;
  }, [scene]);

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
      const progress = Math.min(elapsed / FLIP_DURATION, 1);
      const eased = easeOutCubic(progress);

      chip.rotation.x = BASE_ROTATION.x - Math.PI * 2 * eased;
      chip.rotation.y = BASE_ROTATION.y + Math.sin(progress * Math.PI) * 0.06;
      chip.rotation.z = BASE_ROTATION.z - Math.sin(progress * Math.PI) * 0.025;

      if (progress < 1) {
        invalidate();
      } else {
        chip.rotation.copy(BASE_ROTATION);
        isAnimatingRef.current = false;
      }
      return;
    }

    const targetX = BASE_ROTATION.x + pointerRef.current.y * 0.025;
    const targetY = BASE_ROTATION.y + pointerRef.current.x * 0.04;
    const before = chip.rotation.clone();

    chip.rotation.x = THREE.MathUtils.damp(chip.rotation.x, targetX, 8, delta);
    chip.rotation.y = THREE.MathUtils.damp(chip.rotation.y, targetY, 8, delta);
    chip.rotation.z = THREE.MathUtils.damp(chip.rotation.z, BASE_ROTATION.z, 8, delta);

    const rotationDelta =
      Math.abs(before.x - chip.rotation.x) +
      Math.abs(before.y - chip.rotation.y) +
      Math.abs(before.z - chip.rotation.z);

    if (rotationDelta > 0.0001) {
      invalidate();
    }
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
      <primitive object={model} dispose={null} />
    </group>
  );
}

export default function MagnumChip3D({ onReady, onError }: MagnumChip3DProps = {}) {
  const maxDpr = typeof window !== "undefined" && window.innerWidth < 768 ? 1.25 : 1.5;

  return (
    <ChipSceneErrorBoundary onError={onError}>
      {/* Keep the live GLB visible after the first frame; demand rendering caused it to flash out. */}
      <Canvas
        dpr={[1, maxDpr]}
        frameloop="always"
        camera={{ fov: 32, position: [0, 0.03, 4.15] }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.25;
        }}
        style={{ width: "100%", height: "100%", background: "transparent", cursor: "pointer" }}
      >
        <ambientLight intensity={0.55} color="#FFF5E7" />
        <hemisphereLight args={["#FFF9F2", "#4B0715", 0.75]} />
        <directionalLight position={[-3.5, 3.2, 4.8]} intensity={2.4} color="#FFF2DF" />
        <directionalLight position={[3, 0.6, 3.8]} intensity={0.7} color="#F1EFE9" />
        <pointLight position={[1.8, 1.6, 2.5]} intensity={0.85} color="#D9AA54" />
        <Suspense fallback={null}>
          <ChipModel onReady={onReady} />
        </Suspense>
      </Canvas>
    </ChipSceneErrorBoundary>
  );
}

useGLTF.preload("/models/magnum-chip.glb");
