import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BodySystem, ORGANS } from '../../types/anatomy';
import {
  createBrainModel,
  createCerebellumModel,
  createBrainstemModel,
  createPituitaryModel,
  createLarynxThyroidModel,
  createTracheaModel,
  createHeartModel,
  createLungsModel,
  createLiverModel,
  createGallbladderModel,
  createStomachModel,
  createPancreasModel,
  createSmallIntestineModel,
  createLargeIntestineModel,
  createAppendixModel,
  createSkullSpineModel,
  createMouthTongueModel,
  createHumanBodySilhouette,
  OrganMeshGroup,
} from './organModels';
import { createTorsoTexture, createHeadCrossSectionTexture } from './anatomicalTextures';

export type ViewFocusMode = 'full' | 'torso' | 'head';

interface AnatomySceneProps {
  selectedOrganId: string | null;
  hoveredOrganId: string | null;
  onSelectOrgan: (organId: string | null) => void;
  onHoverOrgan: (organId: string | null) => void;
  activeSystem: BodySystem;
  skinMode: 'xray' | 'ghost' | 'hidden';
  explodedRatio: number; // 0 (natural) to 1 (fully exploded)
  isAutoRotate: boolean;
  viewFocus: ViewFocusMode;
}

// Module-scope pre-allocated helpers to avoid GC in animation loop
const _vec3 = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _targetControlsCenter = new THREE.Vector3();
const _defaultCameraPos = new THREE.Vector3(0, 2.2, 7.5);
const _defaultControlsTarget = new THREE.Vector3(0, 1.8, 0);

export const AnatomyScene: React.FC<AnatomySceneProps> = ({
  selectedOrganId,
  hoveredOrganId,
  onSelectOrgan,
  onHoverOrgan,
  activeSystem,
  skinMode,
  explodedRatio,
  isAutoRotate,
  viewFocus,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // References to procedural organ groups & anatomical illustrated plates
  const organGroupsRef = useRef<OrganMeshGroup[]>([]);
  const bodySilhouetteRef = useRef<ReturnType<typeof createHumanBodySilhouette> | null>(null);
  const torsoPlaneRef = useRef<THREE.Mesh | null>(null);
  const headPlaneRef = useRef<THREE.Mesh | null>(null);

  // Animation & target state refs for smooth transitions without React re-mounting
  const targetCameraPosRef = useRef<THREE.Vector3>(_defaultCameraPos.clone());
  const targetLookAtRef = useRef<THREE.Vector3>(_defaultControlsTarget.clone());
  const explodedRatioRef = useRef(explodedRatio);
  explodedRatioRef.current = explodedRatio;

  const selectedOrganIdRef = useRef(selectedOrganId);
  selectedOrganIdRef.current = selectedOrganId;
  const hoveredOrganIdRef = useRef(hoveredOrganId);
  hoveredOrganIdRef.current = hoveredOrganId;
  const activeSystemRef = useRef(activeSystem);
  activeSystemRef.current = activeSystem;

  // Initialize Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Horizon Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050814); // Deep navy medical studio void
    scene.fog = new THREE.FogExp2(0x050814, 0.045);
    sceneRef.current = scene;

    // 2. Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.copy(_defaultCameraPos);
    cameraRef.current = camera;

    // 3. Renderer with PBR pipeline
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Rig
    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff1e6, 1.8);
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -4;
    scene.add(keyLight);

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.1);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    // Cyan Rim / Backlight for translucent organs
    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.5);
    rimLight.position.set(-4, 5, -5);
    scene.add(rimLight);

    // Subtle front fill
    const frontFill = new THREE.DirectionalLight(0xffffff, 0.6);
    frontFill.position.set(0, 2, 6);
    scene.add(frontFill);

    // 6. Contact Shadow Grounding Plane & Pedestal
    const shadowGeo = new THREE.PlaneGeometry(7, 7);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
      grad.addColorStop(0.4, 'rgba(14, 165, 233, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.7;
    scene.add(shadowPlane);

    // Circular pedestal ring
    const ringGeo = new THREE.RingGeometry(1.6, 1.68, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -2.69;
    scene.add(ringMesh);

    // 7. Add Procedural Organ Models (matching textbook diagrams)
    const organGroups: OrganMeshGroup[] = [
      createBrainModel(),
      createCerebellumModel(),
      createBrainstemModel(),
      createPituitaryModel(),
      createLarynxThyroidModel(),
      createTracheaModel(),
      createHeartModel(),
      createLungsModel(),
      createLiverModel(),
      createGallbladderModel(),
      createStomachModel(),
      createPancreasModel(),
      createSmallIntestineModel(),
      createLargeIntestineModel(),
      createAppendixModel(),
      createSkullSpineModel(),
      createMouthTongueModel(),
    ];
    organGroupsRef.current = organGroups;

    const anatomyRoot = new THREE.Group();
    anatomyRoot.name = 'anatomy_root';
    scene.add(anatomyRoot);

    organGroups.forEach((og) => {
      // Attach userData for raycasting identification
      og.group.traverse((child) => {
        child.userData = { organId: og.organId };
      });
      anatomyRoot.add(og.group);
    });

    // 8. Add Human Silhouette / Skin
    const silhouette = createHumanBodySilhouette();
    bodySilhouetteRef.current = silhouette;
    anatomyRoot.add(silhouette.group);

    // 8b. Add Anatomical Illustrated Backdrop Plates (faithful to user photos kardia1.jpg & Diatomi)
    const torsoTex = createTorsoTexture();
    const torsoMat = new THREE.MeshBasicMaterial({
      map: torsoTex,
      transparent: true,
      opacity: 0.94,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const torsoPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.8), torsoMat);
    torsoPlane.position.set(0, 1.85, -0.04);
    torsoPlaneRef.current = torsoPlane;
    anatomyRoot.add(torsoPlane);

    const headTex = createHeadCrossSectionTexture();
    const headMat = new THREE.MeshBasicMaterial({
      map: headTex,
      transparent: true,
      opacity: 0.94,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const headPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 2.45), headMat);
    headPlane.position.set(0, 4.35, -0.04);
    headPlaneRef.current = headPlane;
    anatomyRoot.add(headPlane);

    // 9. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.copy(_defaultControlsTarget);
    controls.minDistance = 1.2;
    controls.maxDistance = 16;
    controls.maxPolarAngle = Math.PI * 0.95;
    controls.autoRotate = isAutoRotate;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // 10. Raycasting for organ interaction (hover & click)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let pointerDownPos = { x: 0, y: 0 };

    const getIntersectedOrganId = (event: MouseEvent | Touch): string | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Collect all meshes in organ groups (excluding silhouette)
      const meshesToTest: THREE.Object3D[] = [];
      organGroups.forEach((og) => {
        if (og.group.visible) {
          og.group.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
              meshesToTest.push(obj);
            }
          });
        }
      });

      const intersects = raycaster.intersectObjects(meshesToTest, false);
      if (intersects.length > 0) {
        let curr: THREE.Object3D | null = intersects[0].object;
        while (curr && curr !== scene) {
          if (curr.userData && curr.userData.organId) {
            return curr.userData.organId;
          }
          curr = curr.parent;
        }
      }
      return null;
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDragging = false;
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    let lastMoveTime = 0;
    const handlePointerMove = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      if (dx > 4 || dy > 4) {
        isDragging = true;
      }

      // Throttle hover raycast (every 30ms) for high performance
      const now = performance.now();
      if (now - lastMoveTime > 30) {
        lastMoveTime = now;
        const hoveredId = getIntersectedOrganId(e);
        renderer.domElement.style.cursor = hoveredId ? 'pointer' : 'grab';
        onHoverOrgan(hoveredId);
      }
    };

    const handlePointerUp = (e: MouseEvent) => {
      if (!isDragging) {
        const clickedId = getIntersectedOrganId(e);
        onSelectOrgan(clickedId);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    dom.addEventListener('mousemove', handlePointerMove);
    dom.addEventListener('mouseup', handlePointerUp);

    // Responsive Resize with ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 11. Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Update organ animations (heartbeat, breathing, brain sparks)
      organGroups.forEach((og) => {
        og.update(time, delta);

        // Smooth exploded view interpolation
        const currentExp = explodedRatioRef.current;
        _vec3.copy(og.basePosition).addScaledVector(og.explodedOffset, currentExp * 1.5);
        og.group.position.copy(_vec3);

        // System visibility check
        const organDef = ORGANS.find((o) => o.id === og.organId);
        const sys = activeSystemRef.current;
        const isVisibleInSys = sys === 'all' || (organDef !== undefined && organDef.system === sys);
        og.group.visible = Boolean(isVisibleInSys);

        // Hover & Selection Highlight
        const isHovered = hoveredOrganIdRef.current === og.organId;
        const isSelected = selectedOrganIdRef.current === og.organId;

        og.materials.forEach((mat) => {
          if ('emissive' in mat && 'emissiveIntensity' in mat) {
            const standardMat = mat as THREE.MeshStandardMaterial;
            if (isSelected) {
              standardMat.emissive.setHex(0x38bdf8);
              standardMat.emissiveIntensity = 0.5 + Math.sin(time * 5) * 0.2;
            } else if (isHovered) {
              standardMat.emissive.setHex(0x06b6d4);
              standardMat.emissiveIntensity = 0.35;
            } else {
              standardMat.emissive.setHex(0x000000);
              standardMat.emissiveIntensity = 0.05;
            }
          }
        });
      });

      // Camera smooth damping transition when focusing on an organ
      controls.target.lerp(targetLookAtRef.current, 0.06);
      if (selectedOrganIdRef.current) {
        camera.position.lerp(targetCameraPosRef.current, 0.06);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', handlePointerDown);
      dom.removeEventListener('mousemove', handlePointerMove);
      dom.removeEventListener('mouseup', handlePointerUp);
      controls.dispose();
      renderer.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, []);

  // Update OrbitControls autoRotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  // Update skin silhouette mode
  useEffect(() => {
    if (bodySilhouetteRef.current) {
      bodySilhouetteRef.current.setSkinMode(skinMode);
    }
  }, [skinMode]);

  // Handle view focus (Full Body vs Torso kardia1 vs Head Cross-Section)
  useEffect(() => {
    if (!controlsRef.current || !cameraRef.current) return;

    if (viewFocus === 'torso') {
      if (torsoPlaneRef.current) torsoPlaneRef.current.visible = true;
      if (headPlaneRef.current) headPlaneRef.current.visible = false;
      targetLookAtRef.current.set(0, 1.95, 0);
      targetCameraPosRef.current.set(0, 2.0, 5.0);
    } else if (viewFocus === 'head') {
      if (torsoPlaneRef.current) torsoPlaneRef.current.visible = false;
      if (headPlaneRef.current) headPlaneRef.current.visible = true;
      targetLookAtRef.current.set(0, 4.35, 0);
      targetCameraPosRef.current.set(0, 4.35, 3.6);
    } else {
      if (torsoPlaneRef.current) torsoPlaneRef.current.visible = true;
      if (headPlaneRef.current) headPlaneRef.current.visible = true;
      targetLookAtRef.current.copy(_defaultControlsTarget);
      targetCameraPosRef.current.copy(_defaultCameraPos);
    }
  }, [viewFocus]);

  // Handle organ camera focus
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    if (selectedOrganId) {
      const organ = ORGANS.find((o) => o.id === selectedOrganId);
      if (organ && organ.cameraTarget) {
        // Target position
        _targetControlsCenter.set(organ.cameraTarget[0], organ.cameraTarget[1], organ.cameraTarget[2]);
        targetLookAtRef.current.copy(_targetControlsCenter);

        // Calculate offset camera pos
        const dist = organ.cameraDistance || 2.2;
        _targetCamPos.set(
          organ.cameraTarget[0] + 0.3,
          organ.cameraTarget[1] + 0.15,
          organ.cameraTarget[2] + dist
        );
        targetCameraPosRef.current.copy(_targetCamPos);
      }
    } else {
      // Reset to full view
      targetLookAtRef.current.copy(_defaultControlsTarget);
      targetCameraPosRef.current.copy(_defaultCameraPos);
    }
  }, [selectedOrganId]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
