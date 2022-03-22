import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';


class CharacterControl {
    constructor(target, camera) {
        this.target = target;
        // this.camera = camera;
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
        };
        this.init();
    }
  
    init() {
        this.set_velocity();
        this.sync_keys_with_movement();
      
    }
  
    
    // when key is pressed
    on_key_down(event) {
      switch (event.keyCode) {
        case 38: // up
          this.keys.forward = true;
          break;
        case 37: // left
          this.keys.left = true;
          break;
        case 40: // down
          this.keys.backward = true;
          break;
        case 39: // right
          this.keys.right = true;
          break;
        case 87: // w
          this.keys.forward = true;
          break;
        case 65: // a
          this.keys.left = true;
          break;
        case 83: // s
          this.keys.backward = true;
          break;
        case 68: // d
          this.keys.right = true;
          break;
        
      }
    }
  
    // when key is not pressed
    on_key_up(event) {
      switch(event.keyCode) {
        case 38: // up
          this.keys.forward = false;
          break;
        case 37: // left
          this.keys.left = false;
          break;
        case 40: // down
          this.keys.backward = false;
          break;
        case 39: // right
          this.keys.right = false;
          break;
        case 87: // w
          this.keys.forward = false;
          break;
        case 65: // a
          this.keys.left = false;
          break;
        case 83: // s
          this.keys.backward = false;
          break;
        case 68: // d
          this.keys.right = false;
          break;
        
      }
    }
  

    set_velocity() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        // y = rotate, z = forward/backward
        this.acceleration = new THREE.Vector3(0, 1, 200);
        this.decceleration = new THREE.Vector3(0, -0.05, -5);
    }


    sync_keys_with_movement() {
        // on movement keys pressed
        document.addEventListener('keydown', (e) => this.on_key_down(e), false);
        document.addEventListener('keyup', (e) => this.on_key_up(e), false);
    }

    position() {
      return this.position;
    }
  
    rotation() {
      if (!this.target) {
        return new THREE.Quaternion();
      }
      return this.target.quaternion;
    }

    // create character movement
    update(time_elapsed_rescaled) {
        const velocity = this.velocity;
        const frame_decceleration = new THREE.Vector3(
            velocity.x * this.decceleration.x * time_elapsed_rescaled,
            velocity.y * this.decceleration.y * time_elapsed_rescaled,
            velocity.z * this.decceleration.z * time_elapsed_rescaled
        );
        frame_decceleration.z = Math.sign(frame_decceleration.z) * Math.min(Math.abs(frame_decceleration.z), Math.abs(velocity.z));
    

        velocity.add(frame_decceleration);
        const target = this.target;
        // theory:https://threejs.org/docs/?q=quater#api/en/math/Quaternion
        const quaternion = new THREE.Quaternion();
        const vect3 = new THREE.Vector3();
        // theory:https://threejs.org/docs/#api/en/math/Quaternion.clone
        const target_quaternion = target.quaternion.clone(); // quaternion of target (character model)
    
        
        // if move forward
        if (this.keys.forward) {
            velocity.z = velocity.z + this.acceleration.z * time_elapsed_rescaled;
        }
        // if move backward
        if (this.keys.backward) {
            velocity.z = velocity.z - this.acceleration.z * time_elapsed_rescaled;
        }
        // if turn left
        if (this.keys.left) {
            vect3.set(0, 1, 0);
            quaternion.setFromAxisAngle(vect3, Math.PI * time_elapsed_rescaled * this.acceleration.y);
            target_quaternion.multiply(quaternion);
        }
        // if turn right
        if (this.keys.right) {
            vect3.set(0, 1, 0);
            quaternion.setFromAxisAngle(vect3, -Math.PI * time_elapsed_rescaled * this.acceleration.y);
            target_quaternion.multiply(quaternion);
        }


        // theory:https://threejs.org/docs/#api/en/math/Quaternion.copy
        target.quaternion.copy(target_quaternion);
        let old_position = new THREE.Vector3();
        old_position = target.position;
        // old_position.copy(target.position);
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(target.quaternion);
        forward.normalize();
        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(target.quaternion);
        sideways.normalize();
        sideways.multiplyScalar(velocity.x * time_elapsed_rescaled);
        forward.multiplyScalar(velocity.z * time_elapsed_rescaled);
        target.position.add(forward);
        target.position.add(sideways);
        old_position = target.position;
        // old_position.copy(target.position);
    }
}


export default CharacterControl;
