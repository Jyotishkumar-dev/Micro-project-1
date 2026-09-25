"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Points } from "@react-three/drei";
import * as THREE from "three";
import dynamic from "next/dynamic";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth < 768;

const PARTICLE_COUNT = 800;
const MOBILE_PARTICLE_COUNT = 200;

const ParticleSystem = () => {
  const { scene, camera, viewport, gl } = useThree();
  const pointsRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const count = isMobile() ? MOBILE_PARTICLE_COUNT : PARTICLE_COUNT;

  useEffect(() => {
    if (!pointsRef.current) return;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    const colorA = new THREE.Color(0x6366f1);
    const colorB = new THREE.Color(0x06b6d4);
    const colorC = new THREE.Color(0x818cf8);

    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = Math.random() * 1.5 + 0.5;
      alphas[i] = Math.random() * 0.6 + 0.2;

      const colorChoice = Math.random();
      const color = new THREE.Color();
      if (colorChoice < 0.4) color.copy(colorA);
      else if (colorChoice < 0.7) color.copy(colorB);
      else color.copy(colorC);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    pointsRef.current.geometry.dispose();
    pointsRef.current.geometry = geometry;
    pointsRef.current.material = material;

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [count]);

  useEffect(() => {
    // Defined inside the effect so the listener is bound to exactly the
    // viewport it was created for, and so the cleanup closes over the same
    // function instance it registered.
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / viewport.width) * 2 - 1;
      mouseRef.current.y = -(event.clientY / viewport.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [viewport.width, viewport.height]);

  useFrame((state, delta) => {
    if (!pointsRef.current || prefersReducedMotion()) return;

    timeRef.current += delta;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = pointsRef.current.geometry.attributes.velocity.array as Float32Array;
    const alphas = pointsRef.current.geometry.attributes.alpha.array as Float32Array;

    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      const dx = positions[i * 3] - mouseRef.current.x * 20;
      const dy = positions[i * 3 + 1] - mouseRef.current.y * 20;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 8) {
        const force = (8 - dist) / 8 * 0.02;
        positions[i * 3] += (dx / dist) * force;
        positions[i * 3 + 1] += (dy / dist) * force;
        alphas[i] = Math.min(1, alphas[i] + 0.01);
      } else {
        alphas[i] = Math.max(0.2, alphas[i] - 0.005);
      }

      const radius = Math.sqrt(
        positions[i * 3] ** 2 + positions[i * 3 + 1] ** 2 + positions[i * 3 + 2] ** 2
      );
      if (radius > 30) {
        positions[i * 3] *= 0.95;
        positions[i * 3 + 1] *= 0.95;
        positions[i * 3 + 2] *= 0.95;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.alpha.needsUpdate = true;

    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x += delta * 0.01;
  });

  return (
    <Points
      ref={pointsRef}
      position={[0, 0, -5]}
    >
      <bufferGeometry>
        <bufferAttribute name="position" itemSize={3} count={count} />
      </bufferGeometry>
    </Points>
  );
};

const FloatingGeometry = () => {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const geometries = useMemo(() => [
    new THREE.IcosahedronGeometry(0.8, 0),
    new THREE.OctahedronGeometry(0.6, 0),
    new THREE.TetrahedronGeometry(0.7, 0),
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
  ], []);

  useEffect(() => {
    if (!groupRef.current) return;

    const count = isMobile() ? 8 : 15;
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });

    for (let i = 0; i < count; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const mesh = new THREE.Mesh(geometry, wireframeMaterial);

      const radius = 8 + Math.random() * 8;
      const theta = (i / count) * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      mesh.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi) - 5
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.001,
          y: (Math.random() - 0.5) * 0.001,
          z: (Math.random() - 0.5) * 0.001,
        },
        orbitRadius: radius,
        orbitTheta: theta,
        orbitPhi: phi,
        orbitSpeed: 0.0001 + Math.random() * 0.0002,
      };

      groupRef.current.add(mesh);
    }

    return () => {
      wireframeMaterial.dispose();
      geometries.forEach((g) => g.dispose());
    };
  }, [geometries]);

  useFrame((_, delta) => {
    if (!groupRef.current || prefersReducedMotion()) return;

    timeRef.current += delta;
    groupRef.current.children.forEach((mesh) => {
      const data = mesh.userData;
      mesh.rotation.x += data.rotationSpeed.x;
      mesh.rotation.y += data.rotationSpeed.y;
      mesh.rotation.z += data.rotationSpeed.z;

      data.orbitTheta += data.orbitSpeed;
      mesh.position.x = data.orbitRadius * Math.sin(data.orbitPhi) * Math.cos(data.orbitTheta);
      mesh.position.y = data.orbitRadius * Math.sin(data.orbitPhi) * Math.sin(data.orbitTheta);
      mesh.position.z = data.orbitRadius * Math.cos(data.orbitPhi) - 5;
    });

    groupRef.current.rotation.y += delta * 0.005;
  });

  return <group ref={groupRef} />;
};

const AmbientLights = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} color="#6366f1" />
      <directionalLight position={[-10, -5, 5]} intensity={0.2} color="#06b6d4" />
      <pointLight position={[0, 0, 10]} intensity={0.1} color="#818cf8" decay={2} />
    </>
  );
};

const HeroScene = () => {
  return (
    <>
      <AmbientLights />
      <FloatingGeometry />
      <ParticleSystem />
    </>
  );
};

export function HeroVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-cyan-500/10"
        aria-hidden="true"
      />
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 25], fov: 50 }}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows={false}
    >
      <HeroScene />
    </Canvas>
  );
}