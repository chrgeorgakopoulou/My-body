import * as THREE from 'three';

export interface OrganMeshGroup {
  group: THREE.Group;
  organId: string;
  materials: THREE.Material[];
  update: (time: number, delta: number) => void;
  basePosition: THREE.Vector3;
  explodedOffset: THREE.Vector3;
}

export function createOrganMaterial(color: number, roughness = 0.35, metalness = 0.05, emissive = 0x000000) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    emissive,
    emissiveIntensity: 0.15,
  });
}

// 1. BRAIN (Εγκέφαλος - Ημισφαίρια)
export function createBrainModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_brain_cerebrum';
  const materials: THREE.Material[] = [];

  const brainMat = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    roughness: 0.45,
    metalness: 0.05,
  });
  materials.push(brainMat);

  // Left Hemisphere
  const leftHemiGeo = new THREE.SphereGeometry(0.38, 24, 24);
  leftHemiGeo.scale(0.85, 1.05, 1.25);
  const leftHemi = new THREE.Mesh(leftHemiGeo, brainMat);
  leftHemi.position.set(-0.2, 0.08, 0);
  leftHemi.castShadow = true;
  group.add(leftHemi);

  // Right Hemisphere
  const rightHemiGeo = new THREE.SphereGeometry(0.38, 24, 24);
  rightHemiGeo.scale(0.85, 1.05, 1.25);
  const rightHemi = new THREE.Mesh(rightHemiGeo, brainMat);
  rightHemi.position.set(0.2, 0.08, 0);
  rightHemi.castShadow = true;
  group.add(rightHemi);

  // Synapse electrical thought particles
  const particleCount = 24;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePos[i * 3] = (Math.random() - 0.5) * 0.7;
    particlePos[i * 3 + 1] = (Math.random() - 0.5) * 0.5 + 0.08;
    particlePos[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xfbcfe8,
    size: 0.04,
    transparent: true,
    opacity: 0.8,
  });
  materials.push(particleMat);
  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  const basePos = new THREE.Vector3(0, 4.45, 0);
  group.position.copy(basePos);

  return {
    group,
    organId: 'brain_cerebrum',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0, 0.9, 0),
    update: (time) => {
      const s = 1 + Math.sin(time * 3) * 0.02;
      leftHemi.scale.set(0.85 * s, 1.05 * s, 1.25 * s);
      rightHemi.scale.set(0.85 * s, 1.05 * s, 1.25 * s);
      particleMat.opacity = 0.5 + Math.sin(time * 6) * 0.4;
    },
  };
}

// 2. CEREBELLUM (Παρεγκεφαλίδα - από Διατομή Κεφαλιού)
export function createCerebellumModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_cerebellum';
  const materials: THREE.Material[] = [];

  const cerebMat = createOrganMaterial(0xa855f7, 0.45);
  materials.push(cerebMat);

  const cerebGeo = new THREE.SphereGeometry(0.24, 20, 20);
  cerebGeo.scale(1.3, 0.8, 0.95);
  const cereb = new THREE.Mesh(cerebGeo, cerebMat);
  cereb.castShadow = true;
  group.add(cereb);

  const basePos = new THREE.Vector3(0, 4.18, -0.24);
  group.position.copy(basePos);

  return {
    group,
    organId: 'cerebellum',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0, 0.4, -0.5),
    update: (time) => {
      cereb.rotation.y = Math.sin(time * 0.5) * 0.03;
    },
  };
}

// 3. BRAINSTEM (Στέλεχος & Προμήκης Μυελός - από Διατομή Κεφαλιού)
export function createBrainstemModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_brainstem';
  const materials: THREE.Material[] = [];

  const stemMat = createOrganMaterial(0x06b6d4, 0.4);
  materials.push(stemMat);

  // Pons bulge (Γέφυρα)
  const ponsGeo = new THREE.SphereGeometry(0.12, 16, 16);
  ponsGeo.scale(1.1, 0.9, 1.3);
  const pons = new THREE.Mesh(ponsGeo, stemMat);
  pons.position.set(0, 0.1, 0.04);
  group.add(pons);

  // Medulla cylinder (Προμήκης μυελός)
  const medGeo = new THREE.CylinderGeometry(0.08, 0.065, 0.38, 16);
  const med = new THREE.Mesh(medGeo, stemMat);
  med.position.set(0, -0.1, 0);
  group.add(med);

  const basePos = new THREE.Vector3(0, 3.88, -0.06);
  group.position.copy(basePos);

  return {
    group,
    organId: 'brainstem',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0, 0.2, -0.3),
    update: () => {},
  };
}

// 4. PITUITARY (Υπόφυση - από Διατομή Κεφαλιού)
export function createPituitaryModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_pituitary';
  const materials: THREE.Material[] = [];

  const pitMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0xdb2777,
    emissiveIntensity: 0.3,
    roughness: 0.2,
  });
  materials.push(pitMat);

  const pitGeo = new THREE.SphereGeometry(0.06, 16, 16);
  const pitMesh = new THREE.Mesh(pitGeo, pitMat);
  group.add(pitMesh);

  const basePos = new THREE.Vector3(0, 4.32, 0.1);
  group.position.copy(basePos);

  return {
    group,
    organId: 'pituitary',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0, 0.6, 0.3),
    update: (time) => {
      pitMat.emissiveIntensity = 0.3 + Math.sin(time * 4) * 0.15;
    },
  };
}

// 5. LARYNX & THYROID (Λάρυγγας & Θυρεοειδής - από kardia1.jpg)
export function createLarynxThyroidModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_larynx_thyroid';
  const materials: THREE.Material[] = [];

  // Larynx cartilage box (Λάρυγγας / Μήλο Αδάμ)
  const larynxMat = createOrganMaterial(0xe2e8f0, 0.4);
  materials.push(larynxMat);
  const larynxGeo = new THREE.BoxGeometry(0.18, 0.22, 0.18);
  const larynx = new THREE.Mesh(larynxGeo, larynxMat);
  larynx.position.set(0, 0.1, 0);
  group.add(larynx);

  // Thyroid butterfly lobes (Θυρεοειδής αδένας)
  const thyroidMat = createOrganMaterial(0xf43f5e, 0.3);
  materials.push(thyroidMat);

  const leftLobeGeo = new THREE.SphereGeometry(0.08, 14, 14);
  leftLobeGeo.scale(0.8, 1.4, 0.8);
  const leftLobe = new THREE.Mesh(leftLobeGeo, thyroidMat);
  leftLobe.position.set(-0.11, -0.04, 0.06);
  group.add(leftLobe);

  const rightLobeGeo = new THREE.SphereGeometry(0.08, 14, 14);
  rightLobeGeo.scale(0.8, 1.4, 0.8);
  const rightLobe = new THREE.Mesh(rightLobeGeo, thyroidMat);
  rightLobe.position.set(0.11, -0.04, 0.06);
  group.add(rightLobe);

  // Isthmus bridge
  const isthmusGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.12, 10);
  isthmusGeo.rotateZ(Math.PI / 2);
  const isthmus = new THREE.Mesh(isthmusGeo, thyroidMat);
  isthmus.position.set(0, -0.06, 0.08);
  group.add(isthmus);

  const basePos = new THREE.Vector3(0, 3.75, 0.2);
  group.position.copy(basePos);

  return {
    group,
    organId: 'larynx_thyroid',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0, 0.3, 0.4),
    update: () => {},
  };
}

// 6. TRACHEA (Τραχεία με χόνδρινους δακτυλίους - από kardia1.jpg)
export function createTracheaModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_trachea';
  const materials: THREE.Material[] = [];

  const tracheaMat = createOrganMaterial(0xcfd8dc, 0.35);
  materials.push(tracheaMat);

  // Main vertical trachea tube
  const tubeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.65, 16);
  const mainTube = new THREE.Mesh(tubeGeo, tracheaMat);
  group.add(mainTube);

  // Cartilage rings
  const ringMat = createOrganMaterial(0x94a3b8, 0.3);
  materials.push(ringMat);
  for (let i = -3; i <= 3; i++) {
    const ringGeo = new THREE.TorusGeometry(0.085, 0.015, 8, 16);
    ringGeo.rotateX(Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = i * 0.08;
    group.add(ring);
  }

  // Bifurcation into primary bronchi
  const leftBronchCurve = new THREE.LineCurve3(new THREE.Vector3(0, -0.32, 0), new THREE.Vector3(0.25, -0.45, -0.02));
  const leftBronch = new THREE.Mesh(new THREE.TubeGeometry(leftBronchCurve, 8, 0.045, 8, false), tracheaMat);
  group.add(leftBronch);

  const rightBronchCurve = new THREE.LineCurve3(new THREE.Vector3(0, -0.32, 0), new THREE.Vector3(-0.25, -0.45, -0.02));
  const rightBronch = new THREE.Mesh(new THREE.TubeGeometry(rightBronchCurve, 8, 0.045, 8, false), tracheaMat);
  group.add(rightBronch);

  const basePos = new THREE.Vector3(0, 3.25, 0.12);
  group.position.copy(basePos);

  return {
    group,
    organId: 'trachea',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0, 0.2, 0.3),
    update: () => {},
  };
}

// 7. HEART (Καρδιά - από kardia1.jpg)
export function createHeartModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_heart';
  const materials: THREE.Material[] = [];

  const muscleMat = new THREE.MeshStandardMaterial({
    color: 0xbe123c,
    roughness: 0.3,
    metalness: 0.1,
  });
  materials.push(muscleMat);

  // Ventricles apex cone
  const apexGeo = new THREE.ConeGeometry(0.32, 0.55, 24);
  apexGeo.rotateX(Math.PI);
  apexGeo.scale(1.1, 1, 0.85);
  const apex = new THREE.Mesh(apexGeo, muscleMat);
  apex.position.set(0, -0.15, 0);
  apex.rotation.z = 0.18;
  apex.castShadow = true;
  group.add(apex);

  // Left & right atria
  const leftAtrium = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 18), muscleMat);
  leftAtrium.position.set(-0.14, 0.16, 0.02);
  group.add(leftAtrium);

  const rightAtrium = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), muscleMat);
  rightAtrium.position.set(0.14, 0.18, 0);
  group.add(rightAtrium);

  // Aorta arch
  const aortaCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0.15, 0),
    new THREE.Vector3(-0.05, 0.45, 0.05),
    new THREE.Vector3(0.18, 0.45, -0.05),
    new THREE.Vector3(0.15, 0.05, -0.1)
  );
  const aortaMat = createOrganMaterial(0xef4444, 0.25, 0.15);
  materials.push(aortaMat);
  const aorta = new THREE.Mesh(new THREE.TubeGeometry(aortaCurve, 20, 0.07, 12, false), aortaMat);
  group.add(aorta);

  // Pulmonary artery
  const pulmCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0.08, 0.15, 0.08),
    new THREE.Vector3(0.12, 0.32, 0.05),
    new THREE.Vector3(-0.16, 0.3, -0.05),
    new THREE.Vector3(-0.25, 0.2, -0.1)
  );
  const pulmMat = createOrganMaterial(0x2563eb, 0.3, 0.1);
  materials.push(pulmMat);
  const pulm = new THREE.Mesh(new THREE.TubeGeometry(pulmCurve, 16, 0.055, 10, false), pulmMat);
  group.add(pulm);

  const basePos = new THREE.Vector3(0.08, 2.5, 0.2);
  group.position.copy(basePos);

  return {
    group,
    organId: 'heart',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0.15, 0.1, 0.65),
    update: (time) => {
      const t = (time * 1.8) % 1;
      let scale = 1;
      if (t < 0.15) {
        scale = 1 + Math.sin((t / 0.15) * Math.PI) * 0.15;
      } else if (t >= 0.25 && t < 0.4) {
        scale = 1 + Math.sin(((t - 0.25) / 0.15) * Math.PI) * 0.1;
      }
      group.scale.set(scale, scale, scale);
    },
  };
}

// 8. LUNGS (Πνεύμονες ΔΕ 3 λοβοί & ΑΡ 2 λοβοί - από kardia1.jpg)
export function createLungsModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_lungs';
  const materials: THREE.Material[] = [];

  const lungMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.5,
    metalness: 0.05,
  });
  materials.push(lungMat);

  // Left lung (2 lobes with cardiac notch)
  const leftLungGeo = new THREE.CapsuleGeometry(0.28, 0.52, 16, 16);
  leftLungGeo.scale(0.85, 1.05, 0.7);
  const leftLung = new THREE.Mesh(leftLungGeo, lungMat);
  leftLung.position.set(0.42, 0, 0);
  leftLung.rotation.z = -0.1;
  leftLung.castShadow = true;
  group.add(leftLung);

  // Right lung (3 lobes, broader)
  const rightLungGeo = new THREE.CapsuleGeometry(0.31, 0.54, 16, 16);
  rightLungGeo.scale(0.95, 1.05, 0.75);
  const rightLung = new THREE.Mesh(rightLungGeo, lungMat);
  rightLung.position.set(-0.42, 0, 0);
  rightLung.rotation.z = 0.1;
  rightLung.castShadow = true;
  group.add(rightLung);

  const basePos = new THREE.Vector3(0, 2.55, 0);
  group.position.copy(basePos);

  return {
    group,
    organId: 'lungs',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0, 0, -0.45),
    update: (time) => {
      const breath = 1 + Math.sin(time * 1.5) * 0.06;
      leftLung.scale.set(0.85 * breath, 1.05 * breath, 0.7 * breath);
      rightLung.scale.set(0.95 * breath, 1.05 * breath, 0.75 * breath);
    },
  };
}

// 9. LIVER (Ήπαρ / Συκώτι - από kardia1.jpg)
export function createLiverModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_liver';
  const materials: THREE.Material[] = [];

  const liverMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    roughness: 0.38,
    metalness: 0.08,
  });
  materials.push(liverMat);

  const liverGeo = new THREE.SphereGeometry(0.44, 24, 24);
  liverGeo.scale(1.3, 0.65, 0.75);
  liverGeo.rotateZ(-0.25);
  const mainLobe = new THREE.Mesh(liverGeo, liverMat);
  mainLobe.castShadow = true;
  group.add(mainLobe);

  const basePos = new THREE.Vector3(-0.34, 1.82, 0.18);
  group.position.copy(basePos);

  return {
    group,
    organId: 'liver',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(-0.55, 0, 0.4),
    update: () => {},
  };
}

// 10. GALLBLADDER (Χοληδόχος Κύστη - από kardia1.jpg)
export function createGallbladderModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_gallbladder';
  const materials: THREE.Material[] = [];

  const gbMat = createOrganMaterial(0x15803d, 0.3);
  materials.push(gbMat);

  const gbGeo = new THREE.SphereGeometry(0.09, 14, 14);
  gbGeo.scale(0.8, 1.4, 0.8);
  const gb = new THREE.Mesh(gbGeo, gbMat);
  gb.rotation.x = 0.3;
  gb.castShadow = true;
  group.add(gb);

  // Cystic duct tube
  const ductCurve = new THREE.LineCurve3(new THREE.Vector3(0, 0.1, 0), new THREE.Vector3(0.08, 0.22, -0.04));
  const duct = new THREE.Mesh(new THREE.TubeGeometry(ductCurve, 6, 0.02, 8, false), gbMat);
  group.add(duct);

  const basePos = new THREE.Vector3(-0.22, 1.55, 0.22);
  group.position.copy(basePos);

  return {
    group,
    organId: 'gallbladder',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(-0.35, -0.1, 0.55),
    update: () => {},
  };
}

// 11. STOMACH (Στομάχι - από kardia1.jpg)
export function createStomachModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_stomach';
  const materials: THREE.Material[] = [];

  const stomachMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.35,
    metalness: 0.05,
  });
  materials.push(stomachMat);

  // J-curve body
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0.12, 0.42, 0),
    new THREE.Vector3(-0.25, 0.35, 0.05),
    new THREE.Vector3(-0.35, -0.25, 0.08),
    new THREE.Vector3(0.15, -0.22, 0)
  );
  const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.17, 16, false);
  const stomachBody = new THREE.Mesh(tubeGeo, stomachMat);
  stomachBody.castShadow = true;
  group.add(stomachBody);

  // Fundus
  const fundus = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), stomachMat);
  fundus.position.set(-0.16, 0.22, 0.02);
  fundus.scale.set(1.1, 1, 0.9);
  group.add(fundus);

  const basePos = new THREE.Vector3(0.26, 1.68, 0.18);
  group.position.copy(basePos);

  return {
    group,
    organId: 'stomach',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0.5, 0, 0.4),
    update: (time) => {
      const churn = 1 + Math.sin(time * 2.2) * 0.03;
      fundus.scale.set(1.1 * churn, churn, 0.9 * churn);
    },
  };
}

// 12. PANCREAS (Πάγκρεας - από kardia1.jpg)
export function createPancreasModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_pancreas';
  const materials: THREE.Material[] = [];

  const pancMat = createOrganMaterial(0xeab308, 0.45);
  materials.push(pancMat);

  // Elongated granular gland body tucked behind stomach
  const pancGeo = new THREE.CapsuleGeometry(0.08, 0.42, 14, 14);
  pancGeo.rotateZ(Math.PI / 2.3);
  pancGeo.scale(1.2, 0.9, 0.7);
  const pancMesh = new THREE.Mesh(pancGeo, pancMat);
  pancMesh.castShadow = true;
  group.add(pancMesh);

  // Pancreatic duct hint
  const ductMat = createOrganMaterial(0xfef08a, 0.3);
  materials.push(ductMat);
  const ductCurve = new THREE.LineCurve3(new THREE.Vector3(-0.2, 0.05, 0.04), new THREE.Vector3(0.2, -0.05, 0.04));
  const ductMesh = new THREE.Mesh(new THREE.TubeGeometry(ductCurve, 10, 0.015, 6, false), ductMat);
  group.add(ductMesh);

  const basePos = new THREE.Vector3(0.08, 1.45, 0.05);
  group.position.copy(basePos);

  return {
    group,
    organId: 'pancreas',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0.1, -0.2, 0.2),
    update: () => {},
  };
}

// 13. SMALL INTESTINE (Λεπτό Έντερο - από kardia1.jpg)
export function createSmallIntestineModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_small_intestine';
  const materials: THREE.Material[] = [];

  const smallIntMat = new THREE.MeshStandardMaterial({
    color: 0xfb923c,
    roughness: 0.38,
    metalness: 0.05,
  });
  materials.push(smallIntMat);

  const loopsGroup = new THREE.Group();
  for (let r = 0; r < 5; r++) {
    const loopGeo = new THREE.TorusGeometry(0.25 - r * 0.04, 0.062, 10, 24, Math.PI * 1.5);
    const loop = new THREE.Mesh(loopGeo, smallIntMat);
    loop.position.set(0, (r - 2) * 0.11, 0.08 + (r % 2) * 0.03);
    loop.rotation.z = r * 0.5;
    loop.castShadow = true;
    loopsGroup.add(loop);
  }
  group.add(loopsGroup);

  const basePos = new THREE.Vector3(0, 0.9, 0.16);
  group.position.copy(basePos);

  return {
    group,
    organId: 'small_intestine',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0, -0.3, 0.5),
    update: (time) => {
      loopsGroup.children.forEach((child, idx) => {
        child.scale.setScalar(1 + Math.sin(time * 2.5 + idx) * 0.035);
      });
    },
  };
}

// 14. LARGE INTESTINE (Παχύ Έντερο - από kardia1.jpg)
export function createLargeIntestineModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_large_intestine';
  const materials: THREE.Material[] = [];

  const colonMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.45,
    metalness: 0.05,
  });
  materials.push(colonMat);

  const colonPath = new THREE.CurvePath<THREE.Vector3>();
  // Ascending
  colonPath.add(new THREE.LineCurve3(new THREE.Vector3(-0.46, -0.35, 0.08), new THREE.Vector3(-0.46, 0.42, 0.08)));
  // Transverse
  colonPath.add(new THREE.LineCurve3(new THREE.Vector3(-0.46, 0.42, 0.08), new THREE.Vector3(0.46, 0.42, 0.08)));
  // Descending
  colonPath.add(new THREE.LineCurve3(new THREE.Vector3(0.46, 0.42, 0.08), new THREE.Vector3(0.46, -0.4, 0.08)));

  const colonGeo = new THREE.TubeGeometry(colonPath, 36, 0.085, 12, false);
  const colonMesh = new THREE.Mesh(colonGeo, colonMat);
  colonMesh.castShadow = true;
  group.add(colonMesh);

  const basePos = new THREE.Vector3(0, 0.82, 0.08);
  group.position.copy(basePos);

  return {
    group,
    organId: 'large_intestine',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0, -0.45, 0.35),
    update: () => {},
  };
}

// 15. APPENDIX (Σκωληκοειδής Απόφυση - από kardia1.jpg)
export function createAppendixModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_appendix';
  const materials: THREE.Material[] = [];

  const appMat = createOrganMaterial(0x059669, 0.3);
  materials.push(appMat);

  const appCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0.1, 0),
    new THREE.Vector3(-0.04, 0, 0.02),
    new THREE.Vector3(-0.02, -0.12, 0.02),
    new THREE.Vector3(-0.06, -0.18, 0)
  );
  const appGeo = new THREE.TubeGeometry(appCurve, 16, 0.025, 8, false);
  const appMesh = new THREE.Mesh(appGeo, appMat);
  appMesh.castShadow = true;
  group.add(appMesh);

  const basePos = new THREE.Vector3(-0.38, 0.42, 0.12);
  group.position.copy(basePos);

  return {
    group,
    organId: 'appendix',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(-0.25, -0.2, 0.4),
    update: () => {},
  };
}

// 16. SKULL & CERVICAL SPINE (Κρανίο & Αυχενικοί Σπόνδυλοι - από Διατομή Κεφαλιού)
export function createSkullSpineModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_skull_spine';
  const materials: THREE.Material[] = [];

  const boneMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.55,
    metalness: 0.1,
  });
  materials.push(boneMat);

  // Skull vault outline
  const vaultGeo = new THREE.TorusGeometry(0.55, 0.04, 12, 32, Math.PI);
  vaultGeo.rotateZ(-Math.PI / 2);
  const vault = new THREE.Mesh(vaultGeo, boneMat);
  vault.position.set(0, 0.25, -0.05);
  group.add(vault);

  // Cervical vertebrae (7)
  for (let i = 0; i < 7; i++) {
    const vertGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 12);
    const vert = new THREE.Mesh(vertGeo, boneMat);
    vert.position.set(0, -0.3 - i * 0.09, -0.18);
    group.add(vert);
  }

  const basePos = new THREE.Vector3(0, 4.25, 0);
  group.position.copy(basePos);

  return {
    group,
    organId: 'skull_spine',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0, 0.2, -0.5),
    update: () => {},
  };
}

// 17. MOUTH, TONGUE & PHARYNX (Στόμα, Γλώσσα & Φάρυγγας - από Διατομή Κεφαλιού)
export function createMouthTongueModel(): OrganMeshGroup {
  const group = new THREE.Group();
  group.name = 'organ_mouth_tongue';
  const materials: THREE.Material[] = [];

  const tongueMat = createOrganMaterial(0xfb7185, 0.35);
  materials.push(tongueMat);

  // Curved muscular tongue
  const tongueGeo = new THREE.SphereGeometry(0.14, 18, 18);
  tongueGeo.scale(1.1, 0.7, 1.4);
  const tongue = new THREE.Mesh(tongueGeo, tongueMat);
  tongue.position.set(0, 0, 0.08);
  tongue.rotation.x = 0.2;
  group.add(tongue);

  const basePos = new THREE.Vector3(0, 4.12, 0.38);
  group.position.copy(basePos);

  return {
    group,
    organId: 'mouth_tongue',
    materials,
    basePosition: basePos,
    explodedOffset: new THREE.Vector3(0, 0.1, 0.45),
    update: () => {},
  };
}

// HUMAN BODY SILHOUETTE
export function createHumanBodySilhouette(): {
  group: THREE.Group;
  materials: { xray: THREE.MeshPhysicalMaterial; ghost: THREE.MeshPhysicalMaterial };
  setSkinMode: (mode: 'xray' | 'ghost' | 'hidden') => void;
} {
  const group = new THREE.Group();
  group.name = 'body_silhouette';

  const xrayMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0ea5e9,
    emissive: 0x0369a1,
    emissiveIntensity: 0.25,
    roughness: 0.15,
    metalness: 0.1,
    transmission: 0.88,
    opacity: 0.38,
    transparent: true,
    depthWrite: false,
    ior: 1.15,
  });

  const ghostMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xfed7aa,
    emissive: 0x451a03,
    emissiveIntensity: 0.1,
    roughness: 0.4,
    metalness: 0.05,
    transmission: 0.78,
    opacity: 0.45,
    transparent: true,
    depthWrite: false,
    ior: 1.2,
  });

  const headGeo = new THREE.SphereGeometry(0.68, 24, 24);
  headGeo.scale(0.85, 1.15, 0.95);
  const head = new THREE.Mesh(headGeo, xrayMaterial);
  head.position.set(0, 4.45, 0);
  group.add(head);

  const neckGeo = new THREE.CylinderGeometry(0.26, 0.32, 0.6, 20);
  const neck = new THREE.Mesh(neckGeo, xrayMaterial);
  neck.position.set(0, 3.7, -0.02);
  group.add(neck);

  const torsoGeo = new THREE.CylinderGeometry(0.72, 0.62, 2.8, 24);
  torsoGeo.scale(1.2, 1, 0.75);
  const torso = new THREE.Mesh(torsoGeo, xrayMaterial);
  torso.position.set(0, 2.1, 0);
  group.add(torso);

  const shoulderGeo = new THREE.CapsuleGeometry(0.55, 1.3, 16, 20);
  shoulderGeo.rotateZ(Math.PI / 2);
  shoulderGeo.scale(1, 0.6, 0.65);
  const shoulder = new THREE.Mesh(shoulderGeo, xrayMaterial);
  shoulder.position.set(0, 3.25, 0);
  group.add(shoulder);

  const hipsGeo = new THREE.CylinderGeometry(0.6, 0.52, 1.1, 24);
  hipsGeo.scale(1.1, 1, 0.8);
  const hips = new THREE.Mesh(hipsGeo, xrayMaterial);
  hips.position.set(0, 0.35, 0);
  group.add(hips);

  const leftArmGeo = new THREE.CylinderGeometry(0.18, 0.14, 2.2, 16);
  leftArmGeo.rotateZ(-0.15);
  const leftArm = new THREE.Mesh(leftArmGeo, xrayMaterial);
  leftArm.position.set(1.05, 2.2, 0);
  group.add(leftArm);

  const rightArmGeo = new THREE.CylinderGeometry(0.18, 0.14, 2.2, 16);
  rightArmGeo.rotateZ(0.15);
  const rightArm = new THREE.Mesh(rightArmGeo, xrayMaterial);
  rightArm.position.set(-1.05, 2.2, 0);
  group.add(rightArm);

  const leftLegGeo = new THREE.CylinderGeometry(0.24, 0.16, 2.6, 18);
  const leftLeg = new THREE.Mesh(leftLegGeo, xrayMaterial);
  leftLeg.position.set(0.42, -1.4, 0);
  group.add(leftLeg);

  const rightLegGeo = new THREE.CylinderGeometry(0.24, 0.16, 2.6, 18);
  const rightLeg = new THREE.Mesh(rightLegGeo, xrayMaterial);
  rightLeg.position.set(-0.42, -1.4, 0);
  group.add(rightLeg);

  const allMeshes = [head, neck, torso, shoulder, hips, leftArm, rightArm, leftLeg, rightLeg];

  const setSkinMode = (mode: 'xray' | 'ghost' | 'hidden') => {
    if (mode === 'hidden') {
      group.visible = false;
      return;
    }
    group.visible = true;
    const targetMat = mode === 'xray' ? xrayMaterial : ghostMaterial;
    allMeshes.forEach((mesh) => {
      mesh.material = targetMat;
    });
  };

  return {
    group,
    materials: { xray: xrayMaterial, ghost: ghostMaterial },
    setSkinMode,
  };
}
