"use client";

import { Canvas, useThree, invalidate } from "@react-three/fiber";
import { useGLTF, Center, ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useState } from "react";

function CameraFit({ target, onReady }: { target: THREE.Object3D, onReady: () => void }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!target) return;

    const box = new THREE.Box3().setFromObject(target);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const distance = (maxDim / 2) / Math.tan(fov / 2) * 1.6;

    camera.position.set(center.x, center.y, center.z + distance);
    camera.lookAt(center);
    camera.updateProjectionMatrix();

    invalidate();
    onReady(); // ← signal that camera is ready
  }, [target, camera]);

  return null;
}

function GltfModel({ onLoaded }: { onLoaded: (scene: THREE.Object3D) => void }) {
  const gltf = useGLTF('/BESPOKE.gltf');

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        console.log('Mesh part name:', child.name);
      }
    });
    onLoaded(gltf.scene);
  }, [gltf.scene, onLoaded]);

  gltf.scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.color.convertSRGBToLinear();
        // mat.roughness = 0.65;
        mat.roughness = 0.8;
        mat.metalness = 0.0;
        // mat.envMapIntensity = 0.4;
        mat.envMapIntensity = 0.2;
        mat.needsUpdate = true;
      }
    }
  });

  const handleClick = (event: any) => {
    event.stopPropagation();
    const clickedMesh = event.object as THREE.Mesh;
    console.log('Clicked part name:', clickedMesh.name);
    if (clickedMesh.isMesh) {
      clickedMesh.material = (clickedMesh.material as THREE.MeshStandardMaterial).clone();
      switch (clickedMesh.name) {
        case 'Laces': console.log('Laces clicked!'); break;
        case 'Sole': console.log('Sole clicked!'); break;
        case 'Upper': console.log('Upper clicked!'); break;
        default: console.log('Clicked:', clickedMesh.name);
      }
    }
  };

  const handlePointerOver = (event: any) => {
    event.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event: any) => {
    event.stopPropagation();
    document.body.style.cursor = 'default';
  };

  return (
    <Center>
      <primitive
        object={gltf.scene}
        rotation={[Math.PI / 2, Math.PI, 0]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </Center>
  );
}

export default function Scene() {
  const [scene, setScene] = useState<THREE.Object3D | null>(null);
  const [ready, setReady] = useState(false); // ← tracks if camera is fitted

  return (
    <div style={{ height: "100vh", opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }}>
      <Canvas
        style={{ height: "100%" }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        shadows={false}
        raycaster={{ params: { Mesh: {}, Line: { threshold: 0.1 } } }}
        scene={{ background: new THREE.Color("#f2f2f2") }}
        gl={{
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        {/* <directionalLight position={[2, 6, 4]} intensity={2} castShadow shadow-mapSize={[2048, 2048]} />
        <hemisphereLight skyColor="#e4e4e4" groundColor={new THREE.Color(242 / 255, 242 / 255, 242 / 255)} intensity={1} />
        <ambientLight intensity={1.0} />
        <directionalLight position={[2, 6, 4]} intensity={2} />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} /> */}
        <directionalLight position={[2, 6, 4]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
        <hemisphereLight skyColor="#e4e4e4" groundColor={new THREE.Color(242 / 255, 242 / 255, 242 / 255)} intensity={1.5} />
        <ambientLight intensity={2.5} />
        <directionalLight position={[2, 6, 4]} intensity={1.5} />
        <directionalLight position={[-4, 2, -3]} intensity={1.0} />
        <directionalLight position={[0, 0, 5]} intensity={1.0} />
        <directionalLight position={[0, 0, -5]} intensity={0.8} />

        <GltfModel onLoaded={setScene} />
        {scene && <CameraFit target={scene} onReady={() => setReady(true)} />}

        <OrbitControls enablePan={false} enableDamping={false} />
      </Canvas>
    </div>
  );
}