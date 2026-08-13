// Vehicles & Livery Constants

export const VEHICLE_TYPES = {
  CAR: 'car',
  MOTORCYCLE: 'motorcycle'
};

export const REAL_CAR_MODELS = [
  { id: 'ferrari', name: 'Ferrari 458 Italia GT', path: '/models/ferrari.glb', scale: 1.0, position: [0, 0, 0] },
  { id: 'toycar', name: 'Cyber GT Concept', path: '/models/toycar.glb', scale: 0.12, position: [0, 0, 0] },
  { id: 'truck', name: 'Classic Vintage Truck', path: '/models/truck.glb', scale: 0.8, position: [0, 0, 0] }
];

export const CAR_PANELS = [
  { id: 'hood', name: 'Kap Mesin', icon: 'Hood' },
  { id: 'roof', name: 'Atap', icon: 'Sun' },
  { id: 'door_l', name: 'Pintu Kiri', icon: 'DoorClosed' },
  { id: 'door_r', name: 'Pintu Kanan', icon: 'DoorClosed' },
  { id: 'fender_l', name: 'Fender Kiri', icon: 'Shield' },
  { id: 'fender_r', name: 'Fender Kanan', icon: 'Shield' },
  { id: 'bumper_f', name: 'Bumper Depan', icon: 'Box' },
  { id: 'bumper_r', name: 'Bumper Belakang', icon: 'Box' },
  { id: 'spoiler', name: 'Spoiler Belakang', icon: 'Wind' },
  { id: 'skirt_l', name: 'Side Skirt Kiri', icon: 'Maximize2' },
  { id: 'skirt_r', name: 'Side Skirt Kanan', icon: 'Maximize2' }
];

export const MOTORCYCLE_PANELS = [
  { id: 'tank', name: 'Tangki Bensin', icon: 'Container' },
  { id: 'fairing_f', name: 'Fairing Depan', icon: 'Shield' },
  { id: 'fairing_l', name: 'Fairing Kiri', icon: 'Layers' },
  { id: 'fairing_r', name: 'Fairing Kanan', icon: 'Layers' },
  { id: 'tail', name: 'Buntut / Tail Cowl', icon: 'Triangle' },
  { id: 'fender_f', name: 'Spakbor Depan', icon: 'ShieldAlert' }
];

export const LOCKED_ENGINE_PARTS = [
  'engine_block',
  'engine_turbo',
  'engine_radiator',
  'engine_cylinder',
  'engine_exhaust',
  'engine_v4',
  'engine_gearbox'
];

export const PAINT_FINISHES = {
  GLOSS: { name: 'Gloss', roughness: 0.2, metalness: 0.15, clearcoat: 0.9, clearcoatRoughness: 0.1 },
  METALLIC: { name: 'Metallic', roughness: 0.25, metalness: 0.85, clearcoat: 0.8, clearcoatRoughness: 0.25 },
  MATTE: { name: 'Matte Satin', roughness: 0.8, metalness: 0.05, clearcoat: 0.0, clearcoatRoughness: 0.9 },
  PEARL: { name: 'Pearl Chameleon', roughness: 0.2, metalness: 0.4, clearcoat: 1.0, clearcoatRoughness: 0.05 }
};

export const DEFAULT_BODY_COLORS = [
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Midnight Black', hex: '#0f141d' },
  { name: 'Miku Turquoise', hex: '#39c5bb' },
  { name: 'Cyber Neon Cyan', hex: '#00f3ff' },
  { name: 'Hot Pink Itasha', hex: '#ff007f' },
  { name: 'Racing Crimson', hex: '#dc2626' },
  { name: 'Vocaloid Violet', hex: '#8b5cf6' },
  { name: 'Kanji Gold', hex: '#f59e0b' }
];

// Encoded SVG Presets
const makeSvgUri = (svgStr) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;

export const DECAL_PRESETS = [
  {
    id: 'preset_miku_chibi',
    name: 'Hatsune Miku Chibi',
    category: 'Anime Character',
    url: makeSvgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><circle cx="150" cy="150" r="140" fill="#39c5bb" opacity="0.2"/><path d="M 80,120 Q 150,40 220,120 Q 250,220 150,280 Q 50,220 80,120 Z" fill="#39c5bb"/><circle cx="110" cy="140" r="15" fill="#ffffff"/><circle cx="190" cy="140" r="15" fill="#ffffff"/><circle cx="110" cy="140" r="8" fill="#0f141d"/><circle cx="190" cy="140" r="8" fill="#0f141d"/><path d="M 135,175 Q 150,190 165,175" stroke="#ff007f" stroke-width="5" fill="none"/><text x="150" y="240" font-family="sans-serif" font-size="24" font-weight="bold" fill="#00f3ff" text-anchor="middle">初音ミク</text></svg>`)
  },
  {
    id: 'preset_cyber_girl',
    name: 'Cyberpunk Girl',
    category: 'Anime Character',
    url: makeSvgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" rx="40" fill="#ff007f" opacity="0.15"/><path d="M50 250 L150 50 L250 250 Z" fill="#ff007f" opacity="0.4"/><circle cx="150" cy="130" r="60" fill="#00f3ff"/><path d="M120 120 Q150 90 180 120 T210 150" stroke="#ffffff" stroke-width="8" fill="none"/><text x="150" y="230" font-family="sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle">CYBER 01</text></svg>`)
  },
  {
    id: 'preset_kanji_itasha',
    name: 'Kanji "痛車" (Itasha)',
    category: 'Typography',
    url: makeSvgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"><rect width="300" height="150" fill="#000000" opacity="0.5" rx="15"/><text x="150" y="105" font-family="serif" font-size="90" font-weight="900" fill="#ff007f" text-anchor="middle" stroke="#ffffff" stroke-width="2">痛車</text></svg>`)
  },
  {
    id: 'preset_kanji_miku',
    name: 'Kanji "初音ミク"',
    category: 'Typography',
    url: makeSvgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="350" height="120" viewBox="0 0 350 120"><text x="175" y="85" font-family="sans-serif" font-size="65" font-weight="900" fill="#39c5bb" text-anchor="middle" stroke="#00f3ff" stroke-width="2">初音ミク</text></svg>`)
  },
  {
    id: 'preset_speed_stripe',
    name: 'Itasha Speed Tribal',
    category: 'Graphic Livery',
    url: makeSvgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><path d="M 0,20 L 350,20 L 400,80 L 50,80 Z" fill="#ff007f"/><path d="M 30,100 L 380,100 L 330,150 L 0,150 Z" fill="#00f3ff"/><circle cx="200" cy="85" r="30" fill="#ffffff"/></svg>`)
  },
  {
    id: 'preset_sakura_blossom',
    name: 'Sakura Petals',
    category: 'Graphic Livery',
    url: makeSvgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><path d="M 150,50 Q 180,100 150,150 Q 120,100 150,50 Z" fill="#ffb7c5"/><path d="M 150,150 Q 200,180 250,150 Q 200,120 150,150 Z" fill="#ffb7c5"/><path d="M 150,150 Q 180,200 150,250 Q 120,200 150,150 Z" fill="#ffb7c5"/><path d="M 150,150 Q 100,180 50,150 Q 100,120 150,150 Z" fill="#ffb7c5"/><circle cx="150" cy="150" r="15" fill="#ff007f"/></svg>`)
  }
];
