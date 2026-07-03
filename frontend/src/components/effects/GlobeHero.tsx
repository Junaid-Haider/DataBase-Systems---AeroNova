import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function GlobeHero() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(600, 600);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current?.appendChild(renderer.domElement);

    // Globe geometry
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      color: 0x1a3a6b,
      emissive: 0x0a1a3a,
      wireframe: false,
      transparent: true,
      opacity: 0.85,
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Wireframe overlay
    const wireGeo = new THREE.SphereGeometry(2.02, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    scene.add(new THREE.Mesh(wireGeo, wireMat));

    // Glow halo
    const glowGeo = new THREE.SphereGeometry(2.3, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(glowGeo, glowMat));

    // Lighting
    scene.add(new THREE.AmbientLight(0x334466, 0.5));
    const dirLight = new THREE.DirectionalLight(0x6699ff, 1.2);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    camera.position.z = 5;

    // Flight arc (great circle path)
    function addFlightArc(
      lat1: number, lon1: number,
      lat2: number, lon2: number,
      color = 0x60a5fa
    ) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 60; i++) {
        const t = i / 60;
        const lat = lat1 + (lat2 - lat1) * t;
        const lon = lon1 + (lon2 - lon1) * t;
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const r = 2.05 + Math.sin(Math.PI * t) * 0.2; // arc above surface
        points.push(new THREE.Vector3(
          -r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        ));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const arcGeo = new THREE.TubeGeometry(curve, 60, 0.006, 6, false);
      const arcMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 });
      scene.add(new THREE.Mesh(arcGeo, arcMat));
    }

    // Sample routes
    addFlightArc(51.5, -0.1, 25.2, 55.3);   // LHR → DXB
    addFlightArc(40.7, -74.0, 51.5, -0.1);  // JFK → LHR
    addFlightArc(35.7, 139.7, 1.3, 103.8);  // TYO → SIN

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute right-0 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none select-none"
      style={{ filter: 'drop-shadow(0 0 40px rgba(59,130,246,0.3))' }}
    />
  );
}
