import * as THREE from 'three';

// Procedural high-resolution textures matching the exact uploaded textbook images:
// 1. kardia1.jpg (Torso internal organs)
// 2. Διατομή_κεφαλιού_01.jpg (Head sagittal cross-section)

export function createTorsoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Transparent dark background
  ctx.clearRect(0, 0, 1024, 1024);

  // Soft body skin silhouette outline (like kardia1.jpg)
  ctx.save();
  ctx.beginPath();
  // Neck
  ctx.moveTo(420, 100);
  ctx.lineTo(420, 170);
  // Left shoulder & arm
  ctx.bezierCurveTo(420, 210, 220, 230, 200, 340);
  ctx.lineTo(240, 500);
  // Left waist
  ctx.lineTo(280, 750);
  ctx.lineTo(340, 960);
  // Bottom hip
  ctx.bezierCurveTo(400, 980, 620, 980, 680, 960);
  // Right waist
  ctx.lineTo(740, 750);
  ctx.lineTo(780, 500);
  // Right shoulder & arm
  ctx.lineTo(820, 340);
  ctx.bezierCurveTo(800, 230, 600, 210, 600, 170);
  ctx.lineTo(600, 100);
  ctx.closePath();

  ctx.fillStyle = '#fed7aa';
  ctx.fill();
  ctx.strokeStyle = '#fba468';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.restore();

  // Thoracic and abdominal cavity cutout
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(512, 570, 230, 340, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();

  // Ribs cut edges along chest sides (like in kardia1.jpg)
  ctx.save();
  ctx.fillStyle = '#fef08a';
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 2;
  for (let i = 0; i < 7; i++) {
    const y = 340 + i * 40;
    // Left rib stub
    ctx.beginPath();
    ctx.ellipse(300 + i * 4, y, 16, 10, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Right rib stub
    ctx.beginPath();
    ctx.ellipse(724 - i * 4, y, 16, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // Major vessels in neck (Jugular veins in blue, Carotid in red)
  ctx.save();
  // Blue jugular veins
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(465, 120);
  ctx.bezierCurveTo(470, 220, 480, 250, 495, 330);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(560, 120);
  ctx.bezierCurveTo(555, 220, 540, 250, 525, 330);
  ctx.stroke();

  // Larynx & Thyroid gland (Λάρυγγας & Θυρεοειδής)
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(490, 130, 44, 40); // Larynx
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.strokeRect(490, 130, 44, 40);

  // Thyroid butterfly gland
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.ellipse(480, 185, 22, 28, -0.2, 0, Math.PI * 2);
  ctx.ellipse(544, 185, 22, 28, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(495, 180, 34, 14); // Isthmus

  // Trachea (Τραχεία)
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(496, 210, 32, 90);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  for (let r = 0; r < 7; r++) {
    ctx.beginPath();
    ctx.moveTo(496, 220 + r * 11);
    ctx.lineTo(528, 220 + r * 11);
    ctx.stroke();
  }
  ctx.restore();

  // Right Lung (ΔΕ Πνεύμονας - 3 lobes with lobar fissures)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(475, 275);
  ctx.bezierCurveTo(420, 260, 330, 310, 335, 460);
  ctx.bezierCurveTo(340, 560, 440, 560, 485, 520);
  ctx.closePath();
  ctx.fillStyle = '#c2410c'; // Warm anatomical lung reddish-brown
  ctx.fill();
  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 3;
  ctx.stroke();
  // Fissure lines
  ctx.strokeStyle = '#431407';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(345, 390);
  ctx.lineTo(465, 410);
  ctx.moveTo(350, 465);
  ctx.lineTo(450, 475);
  ctx.stroke();
  ctx.restore();

  // Left Lung (ΑΡ Πνεύμονας - with bronchial branching tree inside, like in kardia1.jpg!)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(550, 275);
  ctx.bezierCurveTo(600, 260, 690, 310, 685, 460);
  ctx.bezierCurveTo(680, 560, 590, 560, 540, 510);
  ctx.bezierCurveTo(570, 440, 570, 350, 550, 275); // Cardiac notch
  ctx.closePath();
  ctx.fillStyle = '#78350f';
  ctx.fill();
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 3;
  ctx.stroke();

  // White bronchial tree branches
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(555, 330);
  ctx.lineTo(595, 375);
  ctx.lineTo(645, 420);
  ctx.moveTo(595, 375);
  ctx.lineTo(630, 355);
  ctx.moveTo(615, 395);
  ctx.lineTo(650, 460);
  ctx.stroke();
  ctx.restore();

  // Heart (Καρδιά - nestled in center, pointing left)
  ctx.save();
  // Aorta arch on top
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.arc(512, 335, 24, Math.PI, 0);
  ctx.stroke();
  // Heart body
  ctx.beginPath();
  ctx.moveTo(495, 340);
  ctx.bezierCurveTo(460, 370, 480, 450, 545, 475); // Apex pointing left
  ctx.bezierCurveTo(585, 450, 575, 370, 530, 340);
  ctx.closePath();
  ctx.fillStyle = '#be123c';
  ctx.fill();
  ctx.strokeStyle = '#9f1239';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();

  // Liver (Ήπαρ - large dark red wedge on anatomical right)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(330, 550);
  ctx.bezierCurveTo(410, 505, 540, 510, 570, 540);
  ctx.lineTo(580, 620);
  ctx.bezierCurveTo(530, 660, 380, 665, 330, 600);
  ctx.closePath();
  ctx.fillStyle = '#991b1b';
  ctx.fill();
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Falciform dividing line
  ctx.strokeStyle = '#fca5a5';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(495, 520);
  ctx.lineTo(510, 620);
  ctx.stroke();

  // Gallbladder (Χοληδόχος κύστη - green sac under liver)
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.ellipse(435, 635, 14, 20, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Stomach (Στομάχι - J-shape tucked under liver and diaphragm)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(520, 540);
  ctx.bezierCurveTo(620, 530, 665, 580, 645, 645);
  ctx.bezierCurveTo(625, 690, 545, 680, 495, 645);
  ctx.bezierCurveTo(520, 615, 505, 565, 520, 540);
  ctx.closePath();
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 4;
  ctx.stroke();
  // Inner lighter rugae shading
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.ellipse(580, 610, 35, 35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Pancreas (Πάγκρεας - yellowish gland nestled under stomach)
  ctx.save();
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.moveTo(460, 645);
  ctx.bezierCurveTo(530, 635, 610, 650, 620, 675);
  ctx.bezierCurveTo(580, 685, 490, 675, 460, 660);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#a16207';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Large Intestine (Παχύ έντερο / Colon - Gray-brown segmented frame)
  ctx.save();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 36;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  // Ascending (left on screen)
  ctx.moveTo(350, 840);
  ctx.lineTo(350, 690);
  // Hepatic flexure & Transverse colon
  ctx.lineTo(390, 670);
  ctx.lineTo(630, 670);
  // Splenic flexure & Descending
  ctx.lineTo(670, 700);
  ctx.lineTo(670, 850);
  ctx.stroke();

  // Segmented haustra bands
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 4;
  for (let s = 0; s < 14; s++) {
    const x = 370 + s * 22;
    ctx.beginPath();
    ctx.moveTo(x, 652);
    ctx.lineTo(x, 688);
    ctx.stroke();
  }
  ctx.restore();

  // Small Intestine (Λεπτό έντερο - light pink tightly wound convolutions in center)
  ctx.save();
  ctx.fillStyle = '#fb923c';
  ctx.beginPath();
  ctx.ellipse(512, 775, 110, 85, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c2410c';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Convoluted intestinal loops
  ctx.strokeStyle = '#fdba74';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(440, 740);
  ctx.bezierCurveTo(480, 715, 530, 765, 570, 735);
  ctx.bezierCurveTo(595, 785, 430, 785, 520, 815);
  ctx.bezierCurveTo(570, 840, 460, 855, 440, 825);
  ctx.stroke();
  ctx.restore();

  // Appendix (Σκωληκοειδής απόφυση - small worm hanging at lower right)
  ctx.save();
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(348, 860);
  ctx.bezierCurveTo(335, 890, 355, 915, 345, 935);
  ctx.stroke();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createHeadCrossSectionTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 1024, 1024);

  // Profile skin and head silhouette facing right (like Διατομή_κεφαλιού_01.jpg)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(280, 920); // Back of neck
  ctx.lineTo(280, 580);
  ctx.bezierCurveTo(220, 500, 210, 320, 250, 180); // Occiput
  ctx.bezierCurveTo(310, 60, 550, 40, 680, 150); // Cranium top
  ctx.bezierCurveTo(720, 200, 730, 270, 725, 310); // Forehead
  ctx.lineTo(765, 390); // Nose bridge
  ctx.lineTo(785, 420); // Nose tip
  ctx.lineTo(745, 450); // Under nose
  ctx.lineTo(760, 480); // Upper lip
  ctx.lineTo(740, 500); // Mouth cleft
  ctx.lineTo(760, 530); // Lower lip
  ctx.lineTo(735, 570); // Chin
  ctx.bezierCurveTo(710, 640, 660, 670, 640, 920); // Front of neck
  ctx.closePath();
  ctx.fillStyle = '#fed7aa';
  ctx.fill();
  ctx.strokeStyle = '#fba468';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.restore();

  // Cranium bone layer (Κρανίο)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(290, 560);
  ctx.bezierCurveTo(240, 480, 230, 320, 270, 200);
  ctx.bezierCurveTo(330, 90, 540, 70, 660, 170);
  ctx.bezierCurveTo(690, 215, 700, 280, 695, 320);
  ctx.lineWidth = 26;
  ctx.strokeStyle = '#f1f5f9';
  ctx.stroke();
  // Diploe marrow line inside bone
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#cbd5e1';
  ctx.stroke();

  // Superior sagittal sinus (Άνω οβελιαίος κόλπος - dark blue line under skull)
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#1e40af';
  ctx.stroke();
  ctx.restore();

  // Cerebrum (Εγκέφαλος - convolutions and gyri)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(330, 480);
  ctx.bezierCurveTo(280, 380, 290, 240, 340, 180);
  ctx.bezierCurveTo(400, 120, 560, 110, 630, 200);
  ctx.bezierCurveTo(660, 250, 660, 330, 610, 390);
  ctx.bezierCurveTo(570, 410, 490, 420, 420, 410);
  ctx.bezierCurveTo(380, 430, 360, 460, 330, 480);
  ctx.closePath();
  ctx.fillStyle = '#f472b6';
  ctx.fill();
  ctx.strokeStyle = '#db2777';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Sulci and gyri lines
  ctx.strokeStyle = '#be185d';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let g = 0; g < 12; g++) {
    const angle = 0.2 + g * 0.22;
    const cx = 460 + Math.cos(angle) * 110;
    const cy = 270 + Math.sin(angle) * 90;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 1.3);
    ctx.stroke();
  }
  ctx.restore();

  // Corpus Callosum (Μεσολόβιο - C-shaped white matter bridge)
  ctx.save();
  ctx.strokeStyle = '#fdf2f8';
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(460, 360, 65, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();

  // Thalamus (Θάλαμος - central oval)
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.ellipse(470, 385, 34, 25, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Cerebellum (Παρεγκεφαλίδα - with white arbor vitae "Tree of Life")
  ctx.save();
  ctx.fillStyle = '#a855f7';
  ctx.beginPath();
  ctx.ellipse(370, 520, 62, 52, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7e22ce';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Arbor Vitae branches (white tree structure!)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(410, 520);
  ctx.lineTo(365, 520);
  ctx.lineTo(330, 500);
  ctx.moveTo(365, 520);
  ctx.lineTo(335, 540);
  ctx.moveTo(385, 520);
  ctx.lineTo(365, 485);
  ctx.moveTo(385, 520);
  ctx.lineTo(365, 555);
  ctx.stroke();
  ctx.restore();

  // Brainstem: Pons (Γέφυρα) & Medulla (Προμήκης)
  ctx.save();
  ctx.fillStyle = '#06b6d4';
  ctx.beginPath();
  // Pons anterior rounded belly
  ctx.moveTo(435, 440);
  ctx.bezierCurveTo(480, 460, 485, 500, 455, 530);
  // Medulla down
  ctx.lineTo(445, 620);
  ctx.lineTo(405, 620);
  ctx.lineTo(415, 440);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0891b2';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // Pituitary Gland (Υπόφυση - pink bead nestled in bone pocket sella turcica)
  ctx.save();
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.arc(520, 445, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#be185d';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  // Bone sella turcica
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(520, 448, 18, 0, Math.PI);
  ctx.stroke();
  ctx.restore();

  // Cervical Vertebrae (7 Αυχενικοί σπόνδυλοι) & Spinal Cord
  ctx.save();
  // Spinal cord channel
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(405, 620, 20, 300);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  ctx.strokeRect(405, 620, 20, 300);

  // Vertebrae bones
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  for (let v = 0; v < 7; v++) {
    const vy = 635 + v * 38;
    ctx.fillRect(435, vy, 45, 26);
    ctx.strokeRect(435, vy, 45, 26);
    // Intervertebral disc
    if (v < 6) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(435, vy + 26, 45, 10);
      ctx.fillStyle = '#f8fafc';
    }
  }
  ctx.restore();

  // Nasal cavity (Ρινική κοιλότητα with 3 turbinates / κόγχες)
  ctx.save();
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(570, 340, 110, 110);
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  // 3 turbinates
  ctx.beginPath();
  ctx.moveTo(660, 360);
  ctx.lineTo(600, 370);
  ctx.moveTo(665, 395);
  ctx.lineTo(585, 405);
  ctx.moveTo(660, 430);
  ctx.lineTo(580, 435);
  ctx.stroke();
  ctx.restore();

  // Mouth cavity, Tongue (Γλώσσα) & Pharynx (Φάρυγγας)
  ctx.save();
  // Tongue
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.moveTo(560, 520);
  ctx.bezierCurveTo(620, 500, 680, 530, 670, 560);
  ctx.bezierCurveTo(630, 580, 560, 570, 545, 545);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Epiglottis (Επιγλωττίδα) & Trachea entry
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(540, 570);
  ctx.lineTo(540, 920); // Trachea
  ctx.stroke();

  // Esophagus (Οισοφάγος behind trachea)
  ctx.strokeStyle = '#fca5a5';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(505, 580);
  ctx.lineTo(505, 920);
  ctx.stroke();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
