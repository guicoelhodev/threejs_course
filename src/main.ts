import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const gui = new dat.GUI();

const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments: 15,
    heightSegments: 15,
  },
};

gui.add(world.plane, "width", 1, 20).onChange(generatePlane);
gui.add(world.plane, "height", 1, 20).onChange(generatePlane);
gui.add(world.plane, "widthSegments", 1, 20).onChange(generatePlane);
gui.add(world.plane, "heightSegments", 1, 20).onChange(generatePlane);

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  const { array } = planeMesh.geometry.attributes.position as { array: any };

  for (let i = 0; i < array.length; i += 3) {
    // 3 its 3 dimensions (x,y,z)

    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z - Math.random();
  }
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerWidth);
renderer.setPixelRatio(devicePixelRatio);

document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);
camera.position.z = 3;

// plane geometry

const planeGeometry = new THREE.PlaneGeometry(10, 10, 15, 15);

const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
  // @ts-ignore
  flatShading: THREE.ShaderLib,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(planeMesh);

// vertice position randomization

const { array } = planeMesh.geometry.attributes.position as { array: any };

const randomValues = [];

for (let i = 0; i < array.length; i += 3) {
  // 3 its 3 dimensions (x,y,z)

  if (i % 3 === 0) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i] = x + Math.random() - 0.5;
    array[i + 1] = y + Math.random() - 0.5;
    array[i + 2] = z - Math.random();
  }

  randomValues.push(Math.random());
}

//@ts-ignore
planeMesh.geometry.attributes.position.originalPosition =
  //@ts-ignore
  planeMesh.geometry.attributes.position.array;
//@ts-ignore
planeMesh.geometry.attributes.position.randomValues = randomValues;
// lights

const light = new THREE.DirectionalLight(0xffffff, 1);

light.position.set(0, 0, 1);

scene.add(light);

const backlight = new THREE.DirectionalLight(0xffffff, 1);

backlight.position.set(0, 0, -1);

scene.add(backlight);

// animation

let mouse: any = {
  x: undefined,
  y: undefined,
};

let frame = 0;

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  frame += 0.01;

  const { array, originalPosition } = planeMesh.geometry.attributes
    .position as any;

  for (let i = 0; i < array.length; i += 3) {
    array[i] = originalPosition[i] + Math.cos(frame) * 0.004;

    planeMesh.geometry.attributes.position.needsUpdate = true;
  }
};

animate();

addEventListener("mousemove", (evt) => {
  mouse.x = (evt.clientX / innerWidth) * 2 - 1; // separate x and y coordenations
  mouse.y = (evt.clientY / innerHeight) * 2 - 1;
});
