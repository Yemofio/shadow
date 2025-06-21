import * as THREE from 'three';
import { useEffect, useRef } from 'react';

export default function AttackGraph({ alerts }) {
  const mountRef = useRef(null);

  useEffect(() => {
    // Init 3D scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Plot malicious nodes (red) and normal (green)
    alerts.forEach(alert => {
      const color = alert.score >= 0.9 ? 0xff0000 : 0x00ff00;
      const geometry = new THREE.SphereGeometry(0.5);
      const material = new THREE.MeshBasicMaterial({ color });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }, [alerts]);

  return <div ref={mountRef} />;
}
