"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  Effect,
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
} from "postprocessing";

const PALETTE: [number, number, number][] = [
  [1, 0, 0],
  [0.5776, 0.013, 0.013],
  [1, 0.6584, 0],
  [0.3916, 0.552, 0],
  [0.0137, 0.4342, 0],
  [0, 0, 0.6105],
  [0, 0.4342, 1],
  [1, 0, 1],
  [0, 0, 0],
  [1, 1, 1],
];

const MOSAIC_FRAGMENT_SHADER = `
  uniform float uMosaicEnabled;
  uniform float uMosaicPower;
  uniform float uMosaicScale;
  uniform float uMosaicRadius;
  uniform int   uMosaicForm;
  uniform float uMosaicShape;

  uniform float uToonEnabled;
  uniform float uToonPower;
  uniform float uToonOutline;
  uniform float uToonThickness;

  uniform vec3  uBg;

  #define MAX_PALETTE 16
  uniform float uPaletteEnabled;
  uniform float uPaletteStrength;
  uniform float uRedBoost;
  uniform int   uPaletteCount;
  uniform vec3  uPalette[MAX_PALETTE];

  float dot2(vec2 v){ return dot(v, v); }
  float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }

  float sdCircle(vec2 p){ return length(p) - 1.0; }

  float sdBox(vec2 p, float r){
    vec2 d = abs(p) - vec2(1.0 - r);
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
  }

  float sdDiamond(vec2 p){ return (abs(p.x) + abs(p.y)) - 1.0; }

  float sdTriangle(vec2 p){
    const float k = 1.7320508;
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0 / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0, 0.0);
    return -length(p) * sign(p.y);
  }

  float sdHeart(vec2 p){
    p *= 1.2;
    p.y += 0.6;
    p.x = abs(p.x);
    if (p.y + p.x > 1.0)
      return (sqrt(dot2(p - vec2(0.25, 0.75))) - 0.35355);
    return sqrt(min(dot2(p - vec2(0.0, 1.0)), dot2(p - 0.5 * max(p.x + p.y, 0.0)))) * sign(p.x - p.y);
  }

  float sdStar(vec2 p){
    float r = 1.0;
    float rf = 0.45;
    const vec2 k1 = vec2(0.809016994375, -0.587785252292);
    const vec2 k2 = vec2(-0.809016994375, -0.587785252292);
    p.x = abs(p.x);
    p -= 2.0 * max(dot(k1, p), 0.0) * k1;
    p -= 2.0 * max(dot(k2, p), 0.0) * k2;
    p.x = abs(p.x);
    p.y -= r;
    vec2 ba = rf * vec2(-k1.y, k1.x) - vec2(0.0, 1.0);
    float h = clamp(dot(p, ba) / dot(ba, ba), 0.0, r);
    return length(p - ba * h) * sign(p.y * ba.x - p.x * ba.y);
  }

  float sdRing(vec2 p){
    float d = abs(length(p) - 0.65) - 0.3;
    return d;
  }

  float formSDF(vec2 p, int form, float radius){
    if (form == 0) return sdCircle(p);
    if (form == 1) return sdBox(p, radius);
    if (form == 2) return sdTriangle(p);
    if (form == 3) return sdDiamond(p);
    if (form == 4) return sdHeart(p);
    if (form == 5) return sdStar(p);
    return sdRing(p);
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor){
    vec3 color = inputColor.rgb;
    vec2 sampleUv = uv;
    float shapeMask = 1.0;

    if (uMosaicEnabled > 0.5) {
      float cell = max(uMosaicScale, 2.0);
      vec2 grid = resolution / cell;
      vec2 cellId = floor(uv * grid);
      vec2 cellCenter = (cellId + 0.5) / grid;

      vec2 local = (uv * grid - (cellId + 0.5)) * 2.0;
      vec3 cellColor = texture2D(inputBuffer, cellCenter).rgb;

      float scale = mix(1.35, 0.78, clamp(uMosaicShape, 0.0, 1.0));

      int form = uMosaicForm;
      if (form == 7) {
        float h = fract(sin(dot(cellId, vec2(127.1, 311.7))) * 43758.5453);
        form = h < 0.5 ? 0 : 1;
      }

      float d = formSDF(local * scale, form, clamp(uMosaicRadius, 0.0, 0.95));

      float aa = fwidth(d) + 1e-4;
      shapeMask = 1.0 - smoothstep(-aa, aa, d);

      vec3 mosaicColor = mix(uBg, cellColor, shapeMask);
      color = mix(color, mosaicColor, clamp(uMosaicPower, 0.0, 1.0));
      sampleUv = cellCenter;
    }

    if (uToonEnabled > 0.5) {
      float levels = max(uToonPower, 2.0);
      vec3 posterized = floor(color * levels + 0.5) / levels;
      color = posterized;

      if (uToonOutline > 0.0) {
        vec2 texel = 1.0 / max(resolution, vec2(1.0));
        float t = max(uToonThickness, 0.25);
        vec2 off = texel * t;
        if (uMosaicEnabled > 0.5) {
          float cell = max(uMosaicScale, 2.0);
          off = max(off, texel * cell);
        }
        float l0 = luma(texture2D(inputBuffer, uv + vec2(off.x, 0.0)).rgb);
        float l1 = luma(texture2D(inputBuffer, uv - vec2(off.x, 0.0)).rgb);
        float l2 = luma(texture2D(inputBuffer, uv + vec2(0.0, off.y)).rgb);
        float l3 = luma(texture2D(inputBuffer, uv - vec2(0.0, off.y)).rgb);
        float edge = length(vec2(l0 - l1, l2 - l3));
        edge = smoothstep(0.04, 0.5, edge) * uToonOutline;
        color = mix(color, uBg * 0.2, edge * shapeMask);
      }
    }

    if (uPaletteEnabled > 0.5 && uPaletteCount > 0) {
      float warmth = clamp((color.r - color.b) * 1.4, 0.0, 1.0);
      float lit = smoothstep(0.06, 0.25, max(color.r, max(color.g, color.b)));

      float k = clamp(uRedBoost * warmth * lit, 0.0, 1.0);
      vec3 biased = color;
      biased.r = min(1.0, color.r + k * (1.0 - color.r));
      biased.g = color.g * (1.0 - k);
      biased.b = color.b * (1.0 - k);

      vec3 nearest = uPalette[0];
      float best = 1e9;
      for (int i = 0; i < MAX_PALETTE; i++) {
        if (i >= uPaletteCount) break;
        vec3 p = uPalette[i];
        float d = dot(biased - p, biased - p);
        if (d < best) { best = d; nearest = p; }
      }
      color = mix(color, nearest, clamp(uPaletteStrength, 0.0, 1.0));
    }

    outputColor = vec4(color, inputColor.a);
  }
`;

class MosaicToonEffect extends Effect {
  constructor(mosaicScale: number = 8.0) {
    super("MosaicToonEffect", MOSAIC_FRAGMENT_SHADER, {
      uniforms: new Map<string, THREE.Uniform>([
        ["uMosaicEnabled", new THREE.Uniform(1.0)],
        ["uMosaicPower", new THREE.Uniform(1.0)],
        ["uMosaicScale", new THREE.Uniform(mosaicScale)],
        ["uMosaicRadius", new THREE.Uniform(0.5)],
        ["uMosaicForm", new THREE.Uniform(0)],
        ["uMosaicShape", new THREE.Uniform(0.5)],
        ["uToonEnabled", new THREE.Uniform(0.0)],
        ["uToonPower", new THREE.Uniform(6.0)],
        ["uToonOutline", new THREE.Uniform(0.6)],
        ["uToonThickness", new THREE.Uniform(1.2)],
        ["uBg", new THREE.Uniform(new THREE.Vector3(0, 0, 0))],
        ["uPaletteEnabled", new THREE.Uniform(1.0)],
        ["uPaletteStrength", new THREE.Uniform(1.0)],
        ["uRedBoost", new THREE.Uniform(0.0)],
        ["uPaletteCount", new THREE.Uniform(PALETTE.length)],
        [
          "uPalette",
          new THREE.Uniform(
            Array.from({ length: 16 }, (_, i) => {
              const c = PALETTE[i] || [0, 0, 0];
              return new THREE.Vector3(c[0], c[1], c[2]);
            })
          ),
        ],
      ]),
    });
  }

  setMosaicScale(scale: number) {
    const uniform = this.uniforms.get("uMosaicScale");
    if (uniform) uniform.value = scale;
  }
}

interface PixelEarthProps {
  size?: number;
}

export default function PixelEarth({ size = 200 }: PixelEarthProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || size;
    const height = container.clientHeight || size;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    container.innerHTML = "";
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envMap = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envMap;
    scene.environmentIntensity = 0.9;

    scene.add(new THREE.AmbientLight(0xffffff, 1.3));

    const keyLight = new THREE.DirectionalLight("#ffffff", 1.0);
    keyLight.position.set(3.6, 3.6, 5.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x3a5d7f, 0.4);
    fillLight.position.set(-5.0, -3.0, -5.0);
    scene.add(fillLight);

    const fov = 35;
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);
    const tanFov = (f: number) => Math.tan((f * Math.PI) / 360);
    const halfH = (4 * tanFov(45)) / 2;
    camera.position.set(0, 0, halfH / tanFov(35));
    camera.updateProjectionMatrix();

    const controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.minDistance = 0.5;
    controls.maxDistance = 9.0;
    controls.enableZoom = false;

    const pivot = new THREE.Group();
    scene.add(pivot);

    const geometry = new THREE.SphereGeometry(0.8276, 128, 64);

    const textureLoader = new THREE.TextureLoader();
    const colorMap = textureLoader.load("/texture_0.png");
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.wrapS = THREE.RepeatWrapping;
    colorMap.wrapT = THREE.ClampToEdgeWrapping;
    // Horizontal mirror so continents read correctly in the nav
    colorMap.repeat.x = -1;
    colorMap.offset.x = 1;

    const roughnessMap = textureLoader.load("/texture_1.png");
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.ClampToEdgeWrapping;
    roughnessMap.repeat.x = -1;
    roughnessMap.offset.x = 1;

    const material = new THREE.MeshStandardMaterial({
      map: colorMap,
      roughnessMap: roughnessMap,
      metalness: 0.12,
      roughness: 0.85,
      envMapIntensity: 0.4,
    });

    const sphereMesh = new THREE.Mesh(geometry, material);
    sphereMesh.rotation.y = -Math.PI / 2;
    pivot.add(sphereMesh);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const targetScale = ((width * dpr) / 356) * 8.0;
    const mosaicEffect = new MosaicToonEffect(targetScale);
    const bloomEffect = new BloomEffect({
      intensity: 0.14,
      luminanceThreshold: 0.6,
      luminanceSmoothing: 0.25,
      mipmapBlur: true,
      radius: 0.7,
    });

    composer.addPass(new EffectPass(camera, mosaicEffect, bloomEffect));

    const clock = new THREE.Clock();
    let reqId = 0;
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      reqId = requestAnimationFrame(animate);

      const dt = Math.min(clock.getDelta(), 0.05);
      pivot.rotation.y += 0.28 * dt;
      controls.update();
      composer.render();
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      const currentDpr = Math.min(window.devicePixelRatio || 1, 2);
      mosaicEffect.setMosaicScale(((w * currentDpr) / 356) * 8.0);
    };

    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      isRunning = false;
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      controls.dispose();
      composer.dispose();
      pmremGenerator.dispose();
      roomEnv.dispose();
      geometry.dispose();
      material.dispose();
      colorMap.dispose();
      roughnessMap.dispose();
      renderer.dispose();
      container.innerHTML = "";
    };
  }, [size]);

  return (
    <div
      className="globe-frame"
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        aspectRatio: "1 / 1",
        overflow: "hidden",
        borderRadius: "50%",
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      <div
        ref={containerRef}
        className="globe-canvas"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
