import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Member 2 owns this file — build the full animated globe here
// This starter gets a rotating wireframe sphere on screen immediately
// so the app runs before Member 2 has styled it

export default function ThreatGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Base globe — wireframe
    const globeGeo = new THREE.SphereGeometry(1.2, 40, 40);
    const globeMat = new THREE.MeshStandardMaterial({
      color:     0x1D9E75,
      wireframe: true,
      opacity:   0.6,
      transparent: true,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Ambient + point light
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const light = new THREE.PointLight(0x534AB7, 2, 10);
    light.position.set(3, 3, 3);
    scene.add(light);

    camera.position.z = 3;

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      globe.rotation.y += 0.003;
      globe.rotation.x += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '400px', background: 'transparent' }}
    />
  );
}
