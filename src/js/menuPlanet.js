import * as THREE from 'three';

class MenuPlanet {
    constructor(canvas) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);

        // Create planet geometry
        const geometry = new THREE.SphereGeometry(2, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x22d3ee,
            emissive: 0x22d3ee,
            emissiveIntensity: 0.2,
            specular: 0xffffff,
            shininess: 50
        });
        this.planet = new THREE.Mesh(geometry, material);
        
        // Add atmosphere
        const atmosphereGeometry = new THREE.SphereGeometry(2.2, 32, 32);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x22d3ee,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        this.atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(5, 5, 5);
        
        // Add to scene
        this.scene.add(this.planet);
        this.scene.add(this.atmosphere);
        this.scene.add(ambientLight);
        this.scene.add(pointLight);
        
        // Position camera
        this.camera.position.z = 5;
        
        // Start animation
        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        
        // Rotate planet
        this.planet.rotation.y += 0.005;
        this.atmosphere.rotation.y += 0.003;
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export default MenuPlanet;
