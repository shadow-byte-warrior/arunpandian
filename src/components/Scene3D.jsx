import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Icosahedron, Torus } from '@react-three/drei';
import * as THREE from 'three';

/* ------------------------------------------------------------------ *
 *  A light-themed, Awwwards-style interactive 3D scene.
 *  - A glossy distorted "data core" blob at the centre
 *  - Orbiting glass rings
 *  - A drifting particle field
 *  The whole rig gently parallax-follows the pointer.
 * ------------------------------------------------------------------ */

function DataCore() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.12;
    ref.current.rotation.y = t * 0.18;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.1}>
      <Icosahedron ref={ref} args={[1.35, 12]}>
        <MeshDistortMaterial
          color="#111114"
          roughness={0.12}
          metalness={0.9}
          distort={0.38}
          speed={1.7}
          envMapIntensity={0.9}
        />
      </Icosahedron>
    </Float>
  );
}

function GlassRing({ radius = 2.4, tilt = 0.5, speed = 0.25, color = '#2563EB' }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed;
  });
  return (
    <group rotation={[tilt, 0.3, 0]}>
      <Torus ref={ref} args={[radius, 0.012, 16, 160]}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
      </Torus>
    </group>
  );
}

function ParticleField({ count = 900 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a spherical shell for a "data cloud" feel
      const r = 3.2 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.04;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.15;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        sizeAttenuation
        color="#18181B"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

function Rig({ children }) {
  const group = useRef();
  const target = useRef({ x: 0, y: 0 });

  useFrame(({ pointer }) => {
    if (!group.current) return;
    // Ease the whole rig toward the pointer for smooth parallax
    target.current.x += (pointer.y * 0.25 - target.current.x) * 0.05;
    target.current.y += (pointer.x * 0.35 - target.current.y) * 0.05;
    group.current.rotation.x = target.current.x;
    group.current.rotation.y = target.current.y;
  });

  return <group ref={group}>{children}</group>;
}

export default function Scene3D() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduced ? 'demand' : 'always'}
      style={{ background: 'transparent' }}
    >
      {/* Studio lighting for the glossy core */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 3]} intensity={2.4} />
      <directionalLight position={[-5, -2, -4]} intensity={1.1} color="#2563EB" />
      <pointLight position={[0, 0, 5]} intensity={1.2} color="#ffffff" />

      <Suspense fallback={null}>
        <Rig>
          <DataCore />
          <GlassRing radius={2.35} tilt={0.6} speed={0.22} color="#2563EB" />
          <GlassRing radius={2.9} tilt={-0.4} speed={-0.16} color="#c4c4cc" />
          <ParticleField />
        </Rig>
      </Suspense>
    </Canvas>
  );
}
