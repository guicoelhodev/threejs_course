import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// const gui = new dat.GUI();

const world = {
  plane: {
    width: 100,
    height: 50,
    widthSegments: 40,
    heightSegments: 40,
  },
};

// gui.add(world.plane, "width", 1, 100).onChange(generatePlane);
// gui.add(world.plane, "height", 1, 100).onChange(generatePlane);
// gui.add(world.plane, "widthSegments", 1, 80).onChange(generatePlane);
// gui.add(world.plane, "heightSegments", 1, 80).onChange(generatePlane);

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

const planeGeometry = new THREE.PlaneGeometry(50, 50, 40, 40);

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

    array[i] = x + Math.random() - 0.1;
    array[i + 1] = y + Math.random() - 0.5;
    array[i + 2] = z - Math.random() - 0.5;
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

// startship galaxy

const starGeometry = new THREE.BufferGeometry();

const startMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
});

const startVertices = [];

for (let i = 0; i < 6000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;

  startVertices.push(x, y, z);
}

// console.log(startVertices);

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(startVertices, 3)
);

const stars = new THREE.Points(starGeometry, startMaterial);

scene.add(stars);

console.log(starGeometry);

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

  stars.rotation.x += 0.001;
};

animate();

addEventListener("mousemove", (evt) => {
  mouse.x = (evt.clientX / innerWidth) * 2 - 1; // separate x and y coordenations
  mouse.y = (evt.clientY / innerHeight) * 2 - 1;
});

// animation CSS

gsap.to("#name-title", {
  opacity: 1,
  duration: 1.5,
  y: 0,
  ease: "expo",
});

gsap.to("#subtitle", {
  opacity: 1,
  duration: 1.5,
  delay: 0.3,
  y: 0,
  ease: "expo",
});

gsap.to("#showMore", {
  opacity: 1,
  duration: 1.5,
  delay: 0.6,
  y: 0,
  ease: "expo",
});

// camera moviments

document.querySelector("#showMore")?.addEventListener("click", (evt) => {
  evt.preventDefault();

  gsap.to("#container", {
    opacity: 0,
  });

  gsap.to(camera.position, {
    z: 5,
    ease: "power3.inOut",
    duration: 1.5,
  });

  gsap.to(camera.rotation, {
    x: Math.PI / 2,
    ease: "power3.inOut",
    duration: 1.5,
  });

  gsap.to(camera.position, {
    y: 1000,
    ease: "power3.in",
    duration: 1,
    delay: 1.2,
    onComplete: () => {
      window.location = "https://google.com" as any;
    },
  });
});

// add responsivity resize

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);
});
