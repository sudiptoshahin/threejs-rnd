import { useEffect, useRef } from "react";
import * as THREE from 'three';

export default function SpinningCube() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    function makeInstance(geometry, color, x, scene) {
        const material = new THREE.MeshPhongMaterial({ color });

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;

        return cube;
    }


    useEffect(() => {
        const canvas = canvasRef.current;

        // renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

        const fov = 100;
        const aspect = 2;
        //  responsive
        // const aspect = canvas?.clientWidth / canvas?.clientHeight;
        const near = 0.3;
        const far = 2;

        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2;
        //  responsive
        // camera.updateProjectionMatrix();

        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);

        // scene
        const scene = new THREE.Scene();
        scene.add(light);

        // cube
        // const geometry1 = new THREE.BoxGeometry(1, 1, 1);
        // const material1 = new THREE.MeshBasicMaterial({ color: 0x4488AA });
        // const cube1 = new THREE.Mesh(geometry1, material1);
        // scene.add(cube1);

        // another cube
        // const geometry2 = new THREE.BoxGeometry(1.5, 0.2, 3);
        // const material2 = new THREE.MeshPhongMaterial({ color: 0x461B2A });
        // const cube2 = new THREE.Mesh(geometry2, material2);
        // scene.add(cube2);

        //  Render loop
        // let rafId: number;
        // const animate = (time: number) => {
        //     rafId = requestAnimationFrame(animate);

        //     //  resize the renderer to display size
        //     const width = canvas?.clientWidth;
        //     const height = canvas?.clientHeight;

        //     if (canvas?.width !== width || canvas?.height !== height) {
        //         renderer.setSize(width, height, false);
        //         camera.aspect = width / height;
        //         camera.updateProjectionMatrix();
        //     }

        //     time *= 0.001;
        //     cube1.rotation.x = time;
        //     cube1.rotation.y = time;

        //     renderer.render(scene, camera);
        // };

        // rafId = requestAnimationFrame(animate);

        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const cubes = [
            makeInstance(geometry, 0x44aa88, 0, scene),
             makeInstance(geometry, 0xaa8844, 2, scene),
        ];

        function render(time) {
            time *= 0.001;

            cubes.forEach((cube, ndx) => {
                const speed = 1 + ndx * .1;
                const rot = time * speed;
                cube.rotation.x = rot;
                cube.rotation.y = rot;

            });

            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);


        return () => {
            cancelAnimationFrame(rafId);
            // geometry1.dispose();
            // material1.dispose();
            geometry.dispose();
            renderer.dispose();
        }

    }, []);



    return (
        <canvas ref={canvasRef} style={{ width: '100%', height: '100vh', display: 'block' }} />
    )

}