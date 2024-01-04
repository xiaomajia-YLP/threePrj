import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
console.log(THREE);

// 1. 创建渲染器,指定渲染的分辨率和尺寸,然后添加到body中
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.pixelRatio = window.devicePixelRatio;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

// 2. 创建场景
const scene = new THREE.Scene();

// 3. 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 5, 10);
camera.lookAt(0, 0, 0);

// 4. 创建物体
const axis = new THREE.AxesHelper(5);
scene.add(axis);

// 添加立方体
const geometry = new THREE.BoxGeometry(4, 4, 4);
// 因为MeshBasicMaterial不受光源的影像，所以需要将Material改成MeshStandardMaterial
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cube.rotation.y = Math.PI / 4;

const clock = new THREE.Clock();

const animate = () => {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime(); // 返回已经过去的时间, 以秒为单位
  cube.rotation.y = elapsedTime * Math.PI * 0.5; // 两秒自转一圈

  renderer.render(scene, camera);
};
animate();

// 5. 渲染
renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// 添加光源
// 添加一个白色透明度为0.4的环境光，这个环境光会均匀地照亮场景中的所有物体表面，并且使用PBR（Physically-Based Rendering）渲染模型和材质自身的颜色进行混合得到新的颜色
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
// 添加一个白色的方向光，方向光从(10, 0, 10)照向原点(10, 0, 10)， 所以有两个面会收到这个方向光，表面的颜色会更偏亮
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// 阴影
// 1. 渲染器能够渲染阴影效果
renderer.shadowMap.enabled = true;

// 2. 该方向会投射阴影效果
directionalLight.castShadow = true;

// 3. 该立方体会产生影像效果
cube.castShadow = true;

// 4. 新建了一个平面，该平面能够接受投射过来的阴影效果；
const planeGeometry = new THREE.PlaneGeometry(20, 20);
// const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
// 1. 引入图片
import floor from "./images/flore-grass.jpg";
// 2. 初始化纹理加载器
const textloader = new THREE.TextureLoader();
// 3. 给地板加载纹理
const planeMaterial = new THREE.MeshStandardMaterial({
  map: textloader.load(floor),
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -0.5 * Math.PI;
planeMesh.position.set(0, -3, 0);
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// 5. 方向光的辅助线，为了清晰展示方向光的方向和位置
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
scene.add(directionalLightHelper); // 辅助线
