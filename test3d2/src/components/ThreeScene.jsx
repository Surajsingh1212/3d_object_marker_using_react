import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const ThreeScene = () => {
  const canvasRef = useRef();

  useEffect(() => {
    let sceneReady = false;
    const sizes = { width: window.innerWidth, height: window.innerHeight };

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    const controls = new OrbitControls(camera, renderer.domElement);

    // Three.js objects
    let overlayMaterial;

    // Loaders
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/path/to/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    // Animation with GSAP
    const overlayAnimation = () => {
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 });
    };

    // Models loading
    gltfLoader.load('/assets/golf-cart.gltf', (gltf) => {
      console.log('GLTF Loaded:', gltf);
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.rotation.y = Math.PI * -0.6;
      model.position.y = -0.5;
      scene.add(model);
      sceneReady = true;
      overlayAnimation();
    }, undefined, (error) => {
      console.error('Error loading GLTF:', error);
    });

    // Renderer setup
    renderer.setSize(sizes.width, sizes.height);

    // Overlay setup
    const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    overlayMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uAlpha: { value: 1 } },
      vertexShader: `
        void main() { gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        uniform float uAlpha;
        void main() { gl_FragColor = vec4(1.0, 1.0, 1.0, uAlpha); }
      `,
    });
    const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
    scene.add(overlay);

    // Camera setup
    camera.position.set(2, 1, -2);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI * 0.5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (sceneReady) {
        controls.update();
        renderer.render(scene, camera);
      }
    };

    // Event listeners
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
    };

    window.addEventListener('resize', handleResize);

    // Start animation loop
    animate();

    // Clean-up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      // Dispose Three.js resources if needed
      // renderer.dispose();
      // controls.dispose();
    };
  }, []);

  // return <canvas ref={canvasRef} className="webgl" />;
};

export default ThreeScene;
