import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreatGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene setup ──────────────────────────────────
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // ── Main globe wireframe ─────────────────────────
    const globeGeo = new THREE.SphereGeometry(1.2, 40, 40);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x0a2040,    // dark navy blue
      wireframe: true,
      opacity: 0.5,
      transparent: true,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // ── Atmosphere glow layer ────────────────────────
    const atmosGeo = new THREE.SphereGeometry(1.25, 40, 40);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x1D9E75,
      transparent: true,
      opacity: 0.06,
      side: THREE.BackSide,
      // BackSide = render the inside of the sphere = glow effect
    });
    scene.add(new THREE.Mesh(atmosGeo, atmosMat));

    // ── Threat dots (red dots on the globe surface) ──
    const dotGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xff4444 });

    // Place 25 random red dots on the surface
    for (let i = 0; i < 25; i++) {
      const dot = new THREE.Mesh(dotGeo, dotMat);
      // Convert random lat/long to 3D xyz coordinates
      const phi   = Math.acos(2 * Math.random() - 1);  // latitude
      const theta = Math.random() * 2 * Math.PI;         // longitude
      const r     = 1.21; // just outside the globe surface
      dot.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      );
      globe.add(dot); // add to globe so it rotates with it
    }

    // ── Pulsing equator ring ─────────────────────────
    const ringGeo = new THREE.TorusGeometry(1.3, 0.004, 8, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x534AB7, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    // ── Lighting ─────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const light = new THREE.PointLight(0x1D9E75, 2, 10);
    light.position.set(3, 3, 3);
    scene.add(light);

    camera.position.z = 3;

    // ── Animation loop ────────────────────────────────
    let frameId;
    let t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.01;

      globe.rotation.y += 0.003;   // rotate the globe + dots together
      globe.rotation.x  = 0.2;     // slight tilt so it looks like Earth

      // Pulse the ring opacity
      ringMat.opacity = 0.3 + 0.3 * Math.sin(t);

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup — important! ──────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '380px' }} />;
}
