import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  RotateCw,
  RotateCcw,
  Volume2,
  X,
  Sparkles,
  ZoomIn,
  Search,
  Eye,
  Layers,
  Info,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import { OrganItem } from '../../types/anatomy';
import { soundEngine } from '../../audio/soundEffects';
import { getRealOrganSpecimen, RealOrganSpecimen, AnatomicalHotspot } from '../../data/realOrganData';
import {
  createHeartModel,
  createLungsModel,
  createLiverModel,
  createGallbladderModel,
  createStomachModel,
  createPancreasModel,
  createSmallIntestineModel,
  createLargeIntestineModel,
  createAppendixModel,
  createLarynxThyroidModel,
  createTracheaModel,
  createSkullSpineModel,
  createBrainModel,
  createCerebellumModel,
  createBrainstemModel,
  createPituitaryModel,
  createMouthTongueModel,
  OrganMeshGroup,
} from './organModels';

interface OrganPopout3DProps {
  organ: OrganItem;
  onClose: () => void;
  inline?: boolean;
}

type ViewMode = '3d' | 'real_photo';

function getOrganModel(organId: string, textureSrc?: string): OrganMeshGroup {
  let model: OrganMeshGroup;
  switch (organId) {
    case 'heart':
      model = createHeartModel();
      break;
    case 'lung_right':
    case 'lung_left':
    case 'lungs':
      model = createLungsModel();
      break;
    case 'liver':
      model = createLiverModel();
      break;
    case 'gallbladder':
      model = createGallbladderModel();
      break;
    case 'stomach':
      model = createStomachModel();
      break;
    case 'pancreas':
      model = createPancreasModel();
      break;
    case 'small_intestine':
      model = createSmallIntestineModel();
      break;
    case 'large_intestine':
      model = createLargeIntestineModel();
      break;
    case 'appendix':
      model = createAppendixModel();
      break;
    case 'larynx':
    case 'thyroid':
      model = createLarynxThyroidModel();
      break;
    case 'trachea':
      model = createTracheaModel();
      break;
    case 'cranium':
    case 'cervical_vertebrae':
      model = createSkullSpineModel();
      break;
    case 'cerebrum':
    case 'sagittal_sinus':
      model = createBrainModel();
      break;
    case 'cerebellum':
      model = createCerebellumModel();
      break;
    case 'pons_medulla':
      model = createBrainstemModel();
      break;
    case 'pituitary_gland':
      model = createPituitaryModel();
      break;
    case 'tongue_mouth':
    case 'epiglottis_pharynx':
    case 'nasal_cavity':
      model = createMouthTongueModel();
      break;
    default:
      model = createHeartModel();
      break;
  }

  // Apply real anatomical texture if provided
  if (textureSrc && model.materials.length > 0) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      textureSrc,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        model.materials.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.map = tex;
            mat.roughness = 0.32;
            mat.metalness = 0.05;
            mat.needsUpdate = true;
          }
        });
      },
      undefined,
      (err) => {
        console.warn('Could not load texture onto 3D mesh:', err);
      }
    );
  }

  return model;
}

export const OrganPopout3D: React.FC<OrganPopout3DProps> = ({ organ, onClose, inline = false }) => {
  const specimen: RealOrganSpecimen = getRealOrganSpecimen(organ.id);
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<AnatomicalHotspot | null>(null);

  // Photographic 3D tilt & magnifying glass state
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [magnifier, setMagnifier] = useState({
    visible: false,
    x: 0,
    y: 0,
    percentX: 50,
    percentY: 50,
  });

  // 1. Three.js 3D Scene Initialization
  useEffect(() => {
    if (viewMode !== '3d') return;

    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Realistic Anatomical 3-Point Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.4);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa5f3fc, 1.2);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    const backRimLight = new THREE.DirectionalLight(0xf472b6, 1.5);
    backRimLight.position.set(0, 4, -4);
    scene.add(backRimLight);

    // Load Organ Mesh Group with real specimen texture
    const organModel = getOrganModel(organ.id, specimen.imageSrc);
    scene.add(organModel.group);

    // Center geometry
    const box = new THREE.Box3().setFromObject(organModel.group);
    const center = new THREE.Vector3();
    box.getCenter(center);
    organModel.group.position.sub(center);

    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    const radius = sphere.radius > 0.1 ? sphere.radius : 0.45;
    camera.position.set(0, 0.1, radius * 2.8);

    // OrbitControls for smooth 360° free rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 2.4;
    controls.minDistance = radius * 1.1;
    controls.maxDistance = radius * 5.0;
    controlsRef.current = controls;

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      organModel.update(time, delta);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      organModel.materials.forEach((mat) => mat.dispose());
      scene.clear();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [organ.id, viewMode, specimen.imageSrc]);

  // Keep auto-rotate in sync
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

  // Sound and Voice triggers
  const handlePlaySound = () => {
    soundEngine.playOrganSound(organ.soundType);
  };

  const handleSpeakMedical = () => {
    const text = `${organ.name}. ${specimen.medicalDescription}`;
    soundEngine.speakText(text);
  };

  // Preset Views for 3D Camera
  const setCameraPreset = (angle: 'front' | 'back' | 'side' | 'top') => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const dist = controls.object.position.length();

    soundEngine.playClick();
    setIsAutoRotating(false);

    if (angle === 'front') {
      controls.object.position.set(0, 0, dist);
    } else if (angle === 'back') {
      controls.object.position.set(0, 0, -dist);
    } else if (angle === 'side') {
      controls.object.position.set(dist, 0, 0);
    } else if (angle === 'top') {
      controls.object.position.set(0, dist, 0.01);
    }
    controls.update();
  };

  // Interactive 3D tilt and Magnifying glass on the real photo
  const handleMouseMovePhoto = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!photoContainerRef.current) return;
    const rect = photoContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    // Subtle 3D tilt angle
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -14;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 14;
    setTilt({ rx, ry });

    setMagnifier({
      visible: true,
      x,
      y,
      percentX,
      percentY,
    });
  };

  const handleMouseLeavePhoto = () => {
    setTilt({ rx: 0, ry: 0 });
    setMagnifier((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div
      className={
        inline
          ? 'relative w-full h-full flex flex-col items-center justify-center'
          : 'absolute inset-2 sm:inset-4 z-40 bg-slate-950/95 border-2 border-cyan-400/80 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300'
      }
    >
      {/* 1. TOP HEADER & CONTROLS BAR */}
      <div className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-900/90 border-b border-cyan-500/30 flex items-center justify-between gap-2 shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-lg shadow-md border border-white/20 shrink-0"
            style={{ backgroundColor: `${organ.color}35` }}
          >
            {organ.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold font-heading text-white truncate">
                {organ.name}
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                Πραγματική Ανατομία
              </span>
            </div>
            <p className="text-[11px] text-cyan-300/80 truncate">
              {specimen.tissueType}
            </p>
          </div>
        </div>

        {/* Mode Switcher: 3D Model vs Real Photo */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="flex items-center p-0.5 bg-slate-800/90 rounded-xl border border-slate-700">
            <button
              onClick={() => {
                soundEngine.playClick();
                setViewMode('3d');
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === '3d'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Διαδραστικό 3D μοντέλο με 360° περιστροφή"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>3D 360°</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setViewMode('real_photo');
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'real_photo'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Πραγματική ιατρική φωτογραφία υψηλής ευκρίνειας"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Πραγματική Εικόνα</span>
            </button>
          </div>

          {/* Sound trigger */}
          <button
            onClick={handlePlaySound}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold flex items-center gap-1 transition-all"
            title="Άκουσε τον φυσικό ήχο του οργάνου"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ήχος</span>
          </button>

          {/* Pop back into body / Close */}
          {!inline && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700 transition-all ml-1"
              title="Επιστροφή στο σώμα"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN CENTER STAGE */}
      <div className="relative flex-1 w-full h-full min-h-[250px] flex items-center justify-center overflow-hidden">
        {/* Soft pedestal glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${organ.color}25 0%, rgba(15,23,42,0) 70%)`,
          }}
        />

        {/* -------------------- MODE A: 3D THREE.JS CANVAS -------------------- */}
        {viewMode === '3d' && (
          <div className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
            {/* 3D Canvas Container */}
            <div ref={mountRef} className="w-full h-full" />

            {/* Quick Angle Presets Bar */}
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10 shadow-lg z-10 text-[11px]">
              <span className="text-slate-400 font-bold px-1 hidden sm:inline">Γωνία:</span>
              <button
                onClick={() => setCameraPreset('front')}
                className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 font-medium"
              >
                Εμπρός
              </button>
              <button
                onClick={() => setCameraPreset('side')}
                className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 font-medium"
              >
                Πλάγια
              </button>
              <button
                onClick={() => setCameraPreset('back')}
                className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 font-medium"
              >
                Πίσω
              </button>
              <button
                onClick={() => setCameraPreset('top')}
                className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 font-medium hidden sm:inline"
              >
                Άνω
              </button>
            </div>

            {/* Auto-rotate button badge */}
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsAutoRotating((prev) => !prev);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-md ${
                  isAutoRotating
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
                title={isAutoRotating ? 'Παύση περιστροφής' : 'Αυτόματη περιστροφή'}
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
                <span>{isAutoRotating ? 'Αυτόματη Περιστροφή' : 'Σταθερό'}</span>
              </button>
            </div>
          </div>
        )}

        {/* -------------------- MODE B: REAL MEDICAL PHOTOGRAPHY HD -------------------- */}
        {viewMode === 'real_photo' && (
          <div
            ref={photoContainerRef}
            onMouseMove={handleMouseMovePhoto}
            onMouseLeave={handleMouseLeavePhoto}
            className="relative w-full h-full flex items-center justify-center p-3 select-none perspective-[1000px] cursor-crosshair overflow-hidden"
          >
            {/* 3D Tilted Card Container */}
            <div
              className="relative max-w-full max-h-full aspect-square rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl transition-transform duration-75 ease-out"
              style={{
                transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(0.95, 0.95, 0.95)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src={specimen.imageSrc}
                alt={specimen.title}
                className="w-full h-full object-contain pointer-events-none bg-slate-950"
              />

              {/* Glistening sheen overlay responding to tilt */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
                style={{
                  background: `radial-gradient(circle at ${50 + tilt.ry * 2}% ${50 - tilt.rx * 2}%, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0) 60%)`,
                }}
              />

              {/* Anatomical Hotspots on the real photograph */}
              {specimen.hotspots.map((hotspot, idx) => {
                const isSelected = activeHotspot?.title === hotspot.title;
                return (
                  <div
                    key={idx}
                    className="absolute z-20"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEngine.playClick();
                        setActiveHotspot(isSelected ? null : hotspot);
                      }}
                      className={`relative group flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs transition-all shadow-lg border-2 ${
                        isSelected
                          ? 'bg-yellow-400 border-white text-slate-950 scale-125'
                          : 'bg-emerald-500 border-white/90 text-slate-950 hover:scale-110 hover:bg-emerald-400'
                      }`}
                      title={hotspot.title}
                    >
                      {idx + 1}
                      <span className="sr-only">{hotspot.title}</span>
                    </button>
                  </div>
                );
              })}

              {/* Interactive Magnifying Glass Loupe */}
              {magnifier.visible && (
                <div
                  className="absolute pointer-events-none rounded-full border-2 border-cyan-400 shadow-2xl overflow-hidden z-30"
                  style={{
                    width: 140,
                    height: 140,
                    left: magnifier.x - 70,
                    top: magnifier.y - 70,
                    backgroundImage: `url(${specimen.imageSrc})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '350% 350%',
                    backgroundPosition: `${magnifier.percentX}% ${magnifier.percentY}%`,
                    boxShadow: '0 0 25px rgba(6,182,212,0.6)',
                  }}
                >
                  <div className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" />
                  <div className="absolute bottom-1 right-2 bg-slate-900/80 px-1.5 py-0.5 rounded text-[9px] font-bold text-cyan-300">
                    2.5x Ζουμ
                  </div>
                </div>
              )}
            </div>

            {/* Active Hotspot Info Card */}
            {activeHotspot && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs p-3 rounded-2xl bg-slate-900/95 border-2 border-yellow-400/80 text-white shadow-2xl backdrop-blur-md z-30 animate-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-yellow-300 text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>{activeHotspot.title}</span>
                  </div>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {activeHotspot.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. SCIENTIFIC REALITY INFO BANNER */}
      <div className="w-full px-3 py-2 bg-slate-900/95 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0 z-20 text-[11px]">
        <div className="flex items-center gap-2 text-slate-200 min-w-0">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="truncate">
            <span className="font-bold text-cyan-300">Πώς είναι στην πραγματικότητα: </span>
            <span className="text-slate-300">{specimen.realColorDescription}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {viewMode === '3d' ? (
            <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Σύρετε για περιστροφή 360° γύρω-γύρω</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <Search className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Περάστε το ποντίκι για μεγεθυντικό φακό & κλικ στους αριθμούς</span>
            </div>
          )}

          <button
            onClick={handleSpeakMedical}
            className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 flex items-center gap-1 font-semibold text-[10px]"
            title="Ανάγνωση ιατρικής περιγραφής"
          >
            <Volume2 className="w-3 h-3 text-cyan-400" />
            <span>Επεξήγηση</span>
          </button>
        </div>
      </div>
    </div>
  );
};
