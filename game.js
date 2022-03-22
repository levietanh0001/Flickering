
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
// local
// import THREE from './THREE.js';
import CharacterControl from './CharacterControl.js';
import ThirdPersonCamera from './ThirdPersonCamera.js';


class Game {
  constructor() {
    
    this.init();
  }


  init() {
    this.mixers = []; // mixer = animation player
    // renderer renders scene and camera
    this.set_renderer();
    this.set_camera();
    // update camera and renderer on window resize
    this.on_window_resize();
    // lighting
    this.set_light_and_shadow();
    // control type
    this.set_controls();
    // background
    this.set_background();
    // ground
    this.set_ground();
    // scene includes all 3d objects
    this.set_scene();
    // load 3d model with animation          
    this.load_animated_model();
    // load 3d model with animation          
    let i = 0;
    let posy = 0;
    let posz = 200;
    while (i < 5) {
      let posx = -Math.floor(Math.random() * 100);
      this.load_static_model(posx, posy, posz);
      i += 1;
    }
    let j = 0;
    while (j < 5) {
      let posx = Math.floor(Math.random() * 100);
      this.load_static_model(posx, posy, posz);
      j += 1;
    }
    
    // while (i < 5) {  
    //   this.load_static_model(posx, posy, posz);
    //   posx += 50;
    //   i += 1;
    // }
    // while (i < 5) {  
    //   this.load_static_model(posx, posy, posz);
    //   posx -= 50;
    //   i += 1;
    // }
      
    
    
    // load static 3d model
    // this.load_static_model();
    // render 3d model animation
    this.animate();
  }


  set_renderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
  }


  set_camera() {
    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(-25, 50, -80);
    


    // this.third_person_camera = new ThirdPersonCamera(this.camera);
    
  }

  set_light_and_shadow() {
    this.light = new THREE.DirectionalLight(0xFFFFFF, 10);
    this.light.position.set(20, 100, 100);
    this.light.target.position.set(0, 0, 0);
    // enable shadow map
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // shadow map type
    // enable shadow 
    this.light.castShadow = true;
    // shadow map resolution
    this.light.shadow.mapSize.width = 10000;
    this.light.shadow.mapSize.height = 10000;
    // camera view for shadow map
    this.light.shadow.camera.near = 0.5;
    this.light.shadow.camera.far = 500;
    this.light.shadow.camera.left = 500;
    this.light.shadow.camera.right = -500;
    this.light.shadow.camera.top = 500;
    this.light.shadow.camera.bottom = -500;
  }


  set_controls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set( -20, 20, -100 );
    controls.update();
  }


  set_background() {
    // theory:https://www.google.com/url?sa=i&url=https%3A%2F%2Fsubscription.packtpub.com%2Fbook%2Fweb-development%2F9781788629690%2F7%2Fch07lvl1sec99%2Fcube-maps&psig=AOvVaw2lbPS1TBpyJTOcym-quckL&ust=1647583182253000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCOD95eW7zPYCFQAAAAAdAAAAABAD
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        './assets/img/posx.jpg',
        './assets/img/negx.jpg',
        './assets/img/posy.jpg',
        './assets/img/negy.jpg',
        './assets/img/posz.jpg',
        './assets/img/negz.jpg',
    ]);
    this.texture = texture;
  }

  set_ground() {
    const ground_texture = new THREE.TextureLoader().load("../assets/img/negy.jpg");
    ground_texture.wrapS = THREE.RepeatWrapping;
    ground_texture.wrapT = THREE.RepeatWrapping;
    ground_texture.repeat.set( 100, 100 );
    ground_texture.encoding = THREE.sRGBEncoding;
    const ground_material = new THREE.MeshLambertMaterial( { map: ground_texture } );
    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 2000 ), ground_material );
    mesh.position.y = 0.0;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.mesh = mesh;
    
  }

  // scene contains all 3D objects
  set_scene() {
    this.scene = new THREE.Scene();
    this.scene.add(this.light);
    // this.scene.add(light);
    this.scene.background = this.texture;
    // this.scene.add(this.plane);
    this.scene.add( this.mesh );
    const ambient_light = new THREE.AmbientLight( 0xffffff, 8 );
    this.scene.add( ambient_light );
  }


  on_window_resize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
  }

 
  load_static_model(posx=0, posy=0, posz=400) {
    const loader = new FBXLoader();
    loader.setPath('./assets/fbx/'); // base path
    loader.load('./characters/mutants/warrok_w_kurniawan.fbx', (fbx) => {
      // set model size
      fbx.scale.setScalar(0.05);
      fbx.traverse(c => {
        c.castShadow = true; // model shadow
      });
      // add character model to scene
      this.scene.add(fbx);
      fbx.rotation.x = -300;
      fbx.rotation.y = 0;
      fbx.rotation.z = 500;
      fbx.position.x = posx;
      fbx.position.y = posy;
      fbx.position.z = posz;
    });

  }


  load_animated_model() {
    const loader = new FBXLoader();
    loader.setPath('./assets/fbx/'); // base path
    loader.load('./characters/swat/Rifle_Aiming_Idle.fbx', (fbx) => {
      // set model size
      fbx.scale.setScalar(0.15);
      // theory:https://threejs.org/docs/#api/en/core/Object3D.traverse
      fbx.traverse(c => {
        c.castShadow = true; // model shadow
      });

      
      const target = fbx;
      const camera = this.camera;
      this.character_control = new CharacterControl(target, camera);
      

      
      const animation = new FBXLoader();
      animation.setPath('./assets/fbx/');
      animation.load('./characters/swat/Walk_Forward_inplace.fbx', (animation) => {
        // theory:https://threejs.org/docs/?q=animatio#manual/en/introduction/Animation-system
        const mixer = new THREE.AnimationMixer(fbx);
        this.mixers.push(mixer);
        const action = mixer.clipAction(animation.animations[0]); // an animation clip
        action.play(); // play the model animation
      });
      // add character model to scene
      this.scene.add(fbx);
    });
  }

  
  // theory:https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
  animate() {
    requestAnimationFrame((timestamp) => { //  timestamp indicates the current time (based on the number of milliseconds since time origin (beginning of document)
      if (this.previous_timestamp === null) {
        this.previous_timestamp = timestamp;
      }
      // animation and keys syncing 
      this.step(timestamp - this.previous_timestamp);
      this.previous_timestamp = timestamp;


      this.animate();
    });

    this.renderer.render(this.scene, this.camera);
  }


  // to be in sync, keys physics shares the same time (time_elapsed_rescaled) with animation
  step(time_elapsed) {
    const time_elapsed_rescaled = time_elapsed * 0.001; // affects the speed of the animation
    this.play_animation(time_elapsed_rescaled);
    this.sync_keys_with_animation(time_elapsed_rescaled);
    // this.third_person_camera.update(time_elapsed_rescaled); 
  }


  // play model animation using AnimationMixer
  play_animation(time_elapsed_rescaled) {
    // updates the animation
    if (this.mixers) {
      this.mixers.map(mixer => mixer.update(time_elapsed_rescaled));
    }
  }


  sync_keys_with_animation(time_elapsed_rescaled) {
    // sync keys with character movement
    if (this.character_control) {
      this.character_control.update(time_elapsed_rescaled);
    }
  }



  

  
}


// load game
let game = null;
window.addEventListener('DOMContentLoaded', () => {
  game = new Game();
});
