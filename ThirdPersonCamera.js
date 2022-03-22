import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
// import THREE from "./THREE";


class ThirdPersonCamera {
    constructor(camera, character_control) {
        this.camera = camera;
        this.current_position = new THREE.Vector3();
        this.current_lookat = new THREE.Vector3();
        this.target = character_control;

    }
    compute_ideal_offset() {
        const ideal_offset = new THREE.Vector3(-20, 20, 20);
        ideal_offset.applyQuaternion(this.target.rotation());
        ideal_offset.add(this.target.position());
        return ideal_offset;
    }
    compute_ideal_lookat() {
        const ideal_lookat = new THREE.Vector3();
        ideal_lookat.applyQuaternion(this.target.rotation());
        ideal_lookat.add(this.target.position());
        return ideal_lookat;
    }
    update(time_elapsed_rescaled) {
        const ideal_offset = this.compute_ideal_offset();
        const ideal_lookat = this.compute_ideal_lookat();;
        this.current_position.copy(ideal_offset);
        this.current_lookat.copy(ideal_lookat);
        this.camera.position.copy(this.current_position);
        this.camera.lookAt(this, this.current_lookat)
    }
}

export default ThirdPersonCamera;