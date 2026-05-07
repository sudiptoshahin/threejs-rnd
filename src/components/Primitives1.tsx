import * as THREE from "three";
import { useEffect, useRef } from "react";

export default function Primitives1() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
    });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const fov = 100;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.3;
    const far = 100;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 10;

    const scene = new THREE.Scene();

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // Circle
    // const radius = 7;
    // const segments = 32;
    // const circleGeometry = new THREE.CircleGeometry(radius, segments);
    const material = new THREE.MeshPhongMaterial({ color: 0x5F7470 });
    // const circleMesh = new THREE.Mesh(circleGeometry, material);
    // scene.add(circleMesh);

    // box
    const width = 8;
    const height = 8;
    const depth = 8;
    const widthSegments = 4;
    const heightSegments = 4;
    const depthSegments = 4;
    const boxGeometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
    
    // Circle with theta
    const radius = 7;
    const segements = 24;
    const thetaStart = Math.PI * 0.25;
    const thetaLength = Math.PI * 1.5;
    const circleWithThetaGeometry = new THREE.CircleGeometry(
        radius, segements, thetaStart, thetaLength
    );
    const circleWithThetaMesh = new THREE.Mesh(circleWithThetaGeometry, material);


    
    // function animateCircle(mesh: any) {
    //   requestAnimationFrame(animateCircle);

    //   mesh.position.x += 0.01;
    //   mesh.position.y += 0.01;
    //   mesh.position.z += 0.02;

    //   renderer.render(scene, camera);
    // }

    // const clock = new THREE.Clock();
    function animateCircleWidhtDelta() {
        requestAnimationFrame(animateCircleWidhtDelta);
        circleWithThetaMesh
    }

    animateCircle();
    renderer.render(scene, camera); 

    // cleanup
    return () => {
      renderer.dispose();
      circleGeometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full">
      <canvas className="w-[70%] h-[80vh]" ref={canvasRef} />
    </div>
  );
}