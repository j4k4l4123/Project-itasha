// Vehicles, Itasha Liveries & Graphic Assets Constants

export const VEHICLE_TYPES = {
  CAR: 'car',
  MOTORCYCLE: 'motorcycle'
};

// 7 REAL CAR MODELS (Supercar, Roadster, Daily Hatchback, Kei/Vintage Truck, JDM Tuner, AE86 Drift Legend, Sport Sedan)
export const REAL_CAR_MODELS = [
  {
    id: 'ferrari',
    name: 'Ferrari 458 Italia GT',
    category: 'Supercar',
    path: '/models/ferrari.glb',
    type: 'gltf',
    scale: 1.0,
    position: [0, 0, 0],
    description: 'Mid-engine Italian V8 supercar with aerodynamic GT racing bodywork.',
    badge: '🏎️ Supercar'
  },
  {
    id: 'porsche',
    name: 'Porsche 718 Boxster GTS',
    category: 'Roadster',
    path: '/models/porsche.glb',
    type: 'gltf',
    scale: 1.0,
    position: [0, 0, 0],
    description: 'Authentic German flat-four mid-engine roadster with sleek curves.',
    badge: '🇩🇪 Roadster'
  },
  {
    id: 'compact_car',
    name: 'Honda Jazz / Yaris City Hatch',
    category: 'Daily Hatchback',
    path: '/models/compact_car.glb',
    type: 'gltf',
    scale: 1.0,
    position: [0, 0, 0],
    description: 'Compact 5-door Japanese city hatchback, the most popular canvas for daily street itasha.',
    badge: '🚗 City Hatch'
  },
  {
    id: 'truck',
    name: 'Daihatsu Hijet / Kei Vintage Truck',
    category: 'Kei Truck / Utility',
    path: '/models/truck.glb',
    type: 'gltf',
    scale: 0.85,
    position: [0, 0, 0],
    description: 'Classic Japanese utility Kei Truck with flat cargo bed and upright cabin.',
    badge: '🛻 Kei Truck'
  },
  {
    id: 'toycar',
    name: 'Nissan Silvia S15 / Cyber GT Tuner',
    category: 'JDM Sport Coupe',
    path: '/models/toycar.glb',
    type: 'gltf',
    scale: 0.12,
    position: [0, 0, 0],
    description: 'Aggressive widebody tuner coupe with front splitter and aero kit.',
    badge: '🔰 JDM Tuner'
  },
  {
    id: 'ae86',
    name: 'Toyota Sprinter Trueno AE86',
    category: 'JDM Drift Legend',
    path: null,
    type: 'modular',
    scale: 1.0,
    position: [0, 0, 0],
    description: 'Iconic pop-up headlight drift coupe made famous in Akina mountain passes.',
    badge: '🏔️ AE86 Legend'
  },
  {
    id: 'sedan',
    name: 'Mitsubishi Lancer Evo / WRX STi',
    category: 'Rally Sport Sedan',
    path: null,
    type: 'modular',
    scale: 1.0,
    position: [0, 0, 0],
    description: 'All-wheel drive turbocharged rally sedan with aggressive vents and high rear wing.',
    badge: '🏁 Sport Sedan'
  }
];

// 6 REAL MOTORCYCLE MODELS (Superbike, Vespa Scooter, Cruiser, Naked Streetfighter, Dirt Motocross, Maxi-Scooter)
export const REAL_MOTORCYCLE_MODELS = [
  {
    id: 'superbike',
    name: 'Yamaha YZF-R1 / CBR1000RR',
    category: 'Racing Superbike',
    path: '/models/motorcycle.glb',
    type: 'gltf',
    scale: 1.0,
    position: [0, 0, 0],
    description: '1000cc full-fairing inline-4 track weapon with aerodynamic race cowlings.',
    badge: '🏍️ Superbike'
  },
  {
    id: 'vespa',
    name: 'Vespa Primavera 150 Classic',
    category: 'Retro Urban Scooter',
    path: '/models/vespa_scooter.glb',
    type: 'gltf',
    scale: 1.1,
    position: [0, -0.1, 0],
    description: 'Timeless Italian steel-monocoque scooter with iconic rounded curves.',
    badge: '🛵 Classic Vespa'
  },
  {
    id: 'cruiser',
    name: 'Harley-Davidson Fat Boy V-Twin',
    category: 'American Cruiser',
    path: null,
    type: 'modular',
    scale: 1.0,
    position: [0, 0, 0],
    description: 'Heavyweight low-slung American cruiser with teardrop tank and dual chrome pipes.',
    badge: '🦅 Cruiser'
  },
  {
    id: 'streetfighter',
    name: 'Kawasaki Z900 / Ducati Monster',
    category: 'Naked Streetfighter',
    path: null,
    type: 'modular',
    scale: 1.0,
    position: [0, 0, 0],
    description: 'Muscular streetfighter with exposed trellis frame, sharp radiator cowls, and minimal tail.',
    badge: '⚡ Streetfighter'
  },
  {
    id: 'motocross',
    name: 'Honda CRF450 / Dirt Trail',
    category: 'Offroad Motocross',
    path: null,
    type: 'modular',
    scale: 1.0,
    position: [0, 0, 0],
    description: 'High-clearance motocross dirt bike with rally fenders, knobby tires, and side number plates.',
    badge: '🏔️ Dirt Motocross'
  },
  {
    id: 'maxi_scooter',
    name: 'Yamaha NMAX / Honda PCX 160',
    category: 'Urban Maxi-Scooter',
    path: null,
    type: 'modular',
    scale: 1.0,
    position: [0, 0, 0],
    description: 'Comfortable commuter maxi-scooter with aerodynamic front visor and wide side body.',
    badge: '🏙️ Maxi-Matic'
  }
];

export const CAR_PANELS = [
  { id: 'hood', name: 'Kap Mesin (Hood)', icon: 'Hood' },
  { id: 'roof', name: 'Atap (Roof)', icon: 'Sun' },
  { id: 'door_l', name: 'Pintu Kiri (Left Door)', icon: 'DoorClosed' },
  { id: 'door_r', name: 'Pintu Kanan (Right Door)', icon: 'DoorClosed' },
  { id: 'fender_l', name: 'Fender Kiri (Front Left)', icon: 'Shield' },
  { id: 'fender_r', name: 'Fender Kanan (Front Right)', icon: 'Shield' },
  { id: 'bumper_f', name: 'Bumper Depan', icon: 'Box' },
  { id: 'bumper_r', name: 'Bumper Belakang', icon: 'Box' },
  { id: 'spoiler', name: 'Spoiler / Bagasi', icon: 'Wind' },
  { id: 'skirt_l', name: 'Side Skirt Kiri', icon: 'Maximize2' },
  { id: 'skirt_r', name: 'Side Skirt Kanan', icon: 'Maximize2' }
];

export const MOTORCYCLE_PANELS = [
  { id: 'tank', name: 'Tangki Bensin (Fuel Tank)', icon: 'Container' },
  { id: 'fairing_f', name: 'Fairing Depan / Kedok', icon: 'Shield' },
  { id: 'fairing_l', name: 'Fairing Kiri (Side L)', icon: 'Layers' },
  { id: 'fairing_r', name: 'Fairing Kanan (Side R)', icon: 'Layers' },
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
  'engine_v8',
  'engine_gearbox'
];

export const PAINT_FINISHES = {
  GLOSS: { name: 'Gloss Polyurethane', roughness: 0.15, metalness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.05 },
  METALLIC: { name: 'Metallic Pearl Flake', roughness: 0.2, metalness: 0.85, clearcoat: 0.9, clearcoatRoughness: 0.15 },
  MATTE: { name: 'Matte Satin Wrap', roughness: 0.75, metalness: 0.05, clearcoat: 0.0, clearcoatRoughness: 0.9 },
  PEARL: { name: 'Chameleon Aurora Pearl', roughness: 0.15, metalness: 0.45, clearcoat: 1.0, clearcoatRoughness: 0.02 }
};

export const DEFAULT_BODY_COLORS = [
  { name: 'Miku Turquoise', hex: '#39c5bb' },
  { name: 'Hot Pink Itasha', hex: '#ff007f' },
  { name: 'Pure White (Panda)', hex: '#f8fafc' },
  { name: 'Midnight Obsidian', hex: '#0a0d14' },
  { name: 'Cyber Neon Cyan', hex: '#00f3ff' },
  { name: 'Racing Crimson Red', hex: '#dc2626' },
  { name: 'Vocaloid Violet', hex: '#8b5cf6' },
  { name: 'Speed Gold Pearl', hex: '#f59e0b' }
];

// Helper to encode SVG string into high-quality data URI
const makeSvgUri = (svgStr) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;

// ==========================================
// HIGH QUALITY ENCODED DECAL PRESETS (痛車)
// ==========================================

export const DECAL_PRESETS = [
  // 1. ANIME CHARACTERS
  {
    id: 'preset_miku_racing_2024',
    name: 'Racing Miku 2024 (Hero)',
    category: 'Anime Character',
    url: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
        <defs>
          <linearGradient id="mikuHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00f3ff"/>
            <stop offset="50%" stop-color="#39c5bb"/>
            <stop offset="100%" stop-color="#059669"/>
          </linearGradient>
          <linearGradient id="pinkGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff007f"/>
            <stop offset="100%" stop-color="#ff77bc"/>
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Background Dynamic Aura Ring -->
        <circle cx="300" cy="300" r="260" fill="none" stroke="url(#mikuHair)" stroke-width="8" stroke-dasharray="25 15" opacity="0.6"/>
        <circle cx="300" cy="300" r="235" fill="none" stroke="url(#pinkGlow)" stroke-width="4" opacity="0.8"/>
        <!-- Twintails Back Waves -->
        <path d="M 160,240 C 60,180 20,380 90,520 C 130,420 180,340 210,290 Z" fill="url(#mikuHair)" opacity="0.95"/>
        <path d="M 440,240 C 540,180 580,380 510,520 C 470,420 420,340 390,290 Z" fill="url(#mikuHair)" opacity="0.95"/>
        <!-- Face & Skin -->
        <path d="M 230,220 Q 300,160 370,220 Q 370,340 300,380 Q 230,340 230,220 Z" fill="#fff1e6"/>
        <!-- Bangs / Front Hair -->
        <path d="M 210,210 Q 300,140 390,210 Q 350,270 340,240 Q 300,280 290,240 Q 260,280 240,240 Z" fill="url(#mikuHair)"/>
        <!-- Anime Eyes -->
        <!-- Left Eye -->
        <ellipse cx="265" cy="275" rx="20" ry="28" fill="#39c5bb"/>
        <ellipse cx="265" cy="275" rx="14" ry="20" fill="#0f172a"/>
        <circle cx="258" cy="265" r="7" fill="#ffffff"/>
        <circle cx="272" cy="285" r="4" fill="#00f3ff"/>
        <!-- Right Eye -->
        <ellipse cx="335" cy="275" rx="20" ry="28" fill="#39c5bb"/>
        <ellipse cx="335" cy="275" rx="14" ry="20" fill="#0f172a"/>
        <circle cx="328" cy="265" r="7" fill="#ffffff"/>
        <circle cx="342" cy="285" r="4" fill="#00f3ff"/>
        <!-- Eyelashes & Brows -->
        <path d="M 240,250 Q 265,238 290,252" stroke="#0f172a" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M 310,252 Q 335,238 360,250" stroke="#0f172a" stroke-width="5" stroke-linecap="round" fill="none"/>
        <!-- Blush -->
        <ellipse cx="245" cy="310" rx="15" ry="8" fill="#ff77bc" opacity="0.6"/>
        <ellipse cx="355" cy="310" rx="15" ry="8" fill="#ff77bc" opacity="0.6"/>
        <!-- Smile -->
        <path d="M 285,335 Q 300,350 315,335" stroke="#ff007f" stroke-width="4" stroke-linecap="round" fill="none"/>
        <!-- Racing Headset & Ribbons -->
        <rect x="200" y="240" width="22" height="45" rx="8" fill="#ff007f"/>
        <rect x="378" y="240" width="22" height="45" rx="8" fill="#ff007f"/>
        <path d="M 210,240 Q 300,130 390,240" stroke="#ff007f" stroke-width="8" fill="none"/>
        <!-- Racing Suit Collar -->
        <path d="M 240,360 L 300,430 L 360,360 L 300,380 Z" fill="#0f172a"/>
        <path d="M 280,390 L 300,430 L 320,390 Z" fill="#39c5bb"/>
        <!-- 01 Tattoo Decal -->
        <text x="300" y="490" font-family="'Impact', 'Arial Black', sans-serif" font-size="70" font-weight="900" fill="#ff007f" text-anchor="middle" filter="url(#glow)">01</text>
        <text x="300" y="530" font-family="sans-serif" font-size="22" font-weight="900" fill="#00f3ff" text-anchor="middle" letter-spacing="4">HATSUNE MIKU</text>
      </svg>
    `)
  },
  {
    id: 'preset_cyber_heroine',
    name: 'Cyberpunk Anime Pilot',
    category: 'Anime Character',
    url: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
        <defs>
          <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff0055"/>
            <stop offset="100%" stop-color="#7928ca"/>
          </linearGradient>
        </defs>
        <!-- Hexagon Tech Shield -->
        <polygon points="300,30 540,165 540,435 300,570 60,435 60,165" fill="#0b0f19" stroke="#00f3ff" stroke-width="6"/>
        <polygon points="300,60 510,180 510,420 300,540 90,420 90,180" fill="none" stroke="#ff007f" stroke-width="3" stroke-dasharray="12 8"/>
        <!-- Mecha Visor Character -->
        <circle cx="300" cy="270" r="140" fill="#1e293b"/>
        <!-- Purple Anime Hair -->
        <path d="M 180,240 Q 300,100 420,240 L 400,360 Q 300,380 200,360 Z" fill="url(#cyberGrad)"/>
        <!-- Cyber Visor -->
        <path d="M 210,260 L 390,260 L 360,310 L 240,310 Z" fill="#00f3ff" opacity="0.9"/>
        <text x="300" y="298" font-family="monospace" font-size="24" font-weight="bold" fill="#000" text-anchor="middle">TARGET: LOCKED</text>
        <text x="300" y="470" font-family="'Impact', sans-serif" font-size="52" font-weight="900" fill="#ffffff" text-anchor="middle">NEO TOKYO</text>
        <text x="300" y="505" font-family="sans-serif" font-size="18" font-weight="700" fill="#ff007f" text-anchor="middle" letter-spacing="6">CYBER ITASHA 2077</text>
      </svg>
    `)
  },
  {
    id: 'preset_chibi_miku',
    name: 'Chibi Miku Kawaii',
    category: 'Anime Character',
    url: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="180" fill="#39c5bb" opacity="0.25"/>
        <circle cx="200" cy="180" r="95" fill="#ffe4d6"/>
        <!-- Big Twintails -->
        <path d="M 120,150 C 40,110 30,280 90,320 C 110,260 120,210 140,180 Z" fill="#39c5bb"/>
        <path d="M 280,150 C 360,110 370,280 310,320 C 290,260 280,210 260,180 Z" fill="#39c5bb"/>
        <!-- Hair Fringe -->
        <path d="M 115,160 Q 200,80 285,160 Q 240,210 200,170 Q 160,210 115,160 Z" fill="#39c5bb"/>
        <!-- Cute Huge Eyes -->
        <ellipse cx="165" cy="190" rx="20" ry="26" fill="#0f172a"/>
        <circle cx="158" cy="180" r="8" fill="#ffffff"/>
        <circle cx="172" cy="198" r="4" fill="#39c5bb"/>
        <ellipse cx="235" cy="190" rx="20" ry="26" fill="#0f172a"/>
        <circle cx="228" cy="180" r="8" fill="#ffffff"/>
        <circle cx="242" cy="198" r="4" fill="#39c5bb"/>
        <ellipse cx="140" cy="215" rx="14" ry="7" fill="#ff77bc" opacity="0.8"/>
        <ellipse cx="260" cy="215" rx="14" ry="7" fill="#ff77bc" opacity="0.8"/>
        <path d="M 190,225 Q 200,238 210,225" stroke="#ff007f" stroke-width="4" stroke-linecap="round" fill="none"/>
        <text x="200" y="360" font-family="'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif" font-size="34" font-weight="900" fill="#39c5bb" text-anchor="middle" stroke="#ffffff" stroke-width="1.5">初音ミク</text>
      </svg>
    `)
  },

  // 2. JAPANESE TYPOGRAPHY & KANJI (痛車)
  {
    id: 'preset_kanji_itasha_pro',
    name: 'Kanji "痛車" (Itasha Master)',
    category: 'Typography',
    url: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="240" viewBox="0 0 500 240">
        <rect width="500" height="240" rx="20" fill="#0f172a" fill-opacity="0.9" stroke="#ff007f" stroke-width="4"/>
        <line x1="20" y1="20" x2="480" y2="20" stroke="#00f3ff" stroke-width="3"/>
        <text x="250" y="155" font-family="'Yu Mincho', 'MS Mincho', 'serif'" font-size="140" font-weight="900" fill="#ff007f" text-anchor="middle" stroke="#ffffff" stroke-width="4">痛車</text>
        <text x="250" y="210" font-family="'Impact', sans-serif" font-size="28" font-weight="900" fill="#00f3ff" text-anchor="middle" letter-spacing="8">ITASHA CULTURE</text>
      </svg>
    `)
  },
  {
    id: 'preset_kanji_miku_full',
    name: 'Kanji "初音ミク" (Hatsune Miku)',
    category: 'Typography',
    url: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="550" height="180" viewBox="0 0 550 180">
        <defs>
          <linearGradient id="mikuTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00f3ff"/>
            <stop offset="50%" stop-color="#39c5bb"/>
            <stop offset="100%" stop-color="#ff007f"/>
          </linearGradient>
        </defs>
        <text x="275" y="125" font-family="'Hiragino Sans', 'Meiryo', sans-serif" font-size="105" font-weight="900" fill="url(#mikuTextGrad)" text-anchor="middle" stroke="#0f172a" stroke-width="8">初音ミク</text>
        <text x="275" y="165" font-family="'Arial Black', sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="6">HATSUNE MIKU RACING</text>
      </svg>
    `)
  },
  {
    id: 'preset_kanji_fujiwara',
    name: 'Kanji "藤原とうふ店 (自家用)" Initial D',
    category: 'Typography',
    url: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="150" viewBox="0 0 600 150">
        <text x="300" y="95" font-family="'Yu Mincho', 'MS Mincho', serif" font-size="62" font-weight="900" fill="#000000" text-anchor="middle" stroke="#ffffff" stroke-width="2">藤原とうふ店（自家用）</text>
        <text x="300" y="130" font-family="sans-serif" font-size="16" font-weight="700" fill="#333333" text-anchor="middle" letter-spacing="4">FUJIWARA TOFU SHOP (PROJECT D)</text>
      </svg>
    `)
  },
  {
    id: 'preset_kanji_godspeed',
    name: 'Kanji "神速 最速" (Godspeed)',
    category: 'Typography',
    url: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="200" viewBox="0 0 500 200">
        <rect width="500" height="200" rx="16" fill="#dc2626" fill-opacity="0.85" stroke="#f59e0b" stroke-width="4"/>
        <text x="250" y="135" font-family="'Yu Mincho', serif" font-size="110" font-weight="900" fill="#ffffff" text-anchor="middle" stroke="#000000" stroke-width="4">神速最速</text>
        <text x="250" y="180" font-family="'Impact', sans-serif" font-size="22" font-weight="900" fill="#f59e0b" text-anchor="middle" letter-spacing="6">TOUGE MAXIMUM OVERDRIVE</text>
      </svg>
    `)
  },

  // 3. JDM RACING SPONSORS & MOTORSPORTS BADGES
  {
    id: 'preset_goodsmile_racing',
    name: 'GoodSmile Racing Super GT',
    category: 'Sponsors & Badges',
    url: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="180" viewBox="0 0 500 180">
        <rect width="500" height="180" rx="16" fill="#0f172a" stroke="#39c5bb" stroke-width="4"/>
        <circle cx="90" cy="90" r="55" fill="#ff77bc"/>
        <path d="M 65,85 Q 90,120 115,85" stroke="#ffffff" stroke-width="8" stroke-linecap="round" fill="none"/>
        <circle cx="75" cy="70" r="8" fill="#ffffff"/>
        <circle cx="105" cy="70" r="8" fill="#ffffff"/>
        <text x="300" y="85" font-family="'Impact', sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle">GOODSMILE</text>
        <text x="300" y="135" font-family="'Impact', sans-serif" font-size="44" font-weight="900" fill="#39c5bb" text-anchor="middle">RACING TEAM</text>
      </svg>
    `)
  },
  {
    id: 'preset_jdm_sponsors_grid',
    name: 'JDM Tuner Brands (HKS / Bride / Rays)',
    category: 'Sponsors & Badges',
    url: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="400" viewBox="0 0 500 400">
        <g transform="translate(0, 0)">
          <!-- HKS -->
          <rect x="30" y="20" width="440" height="90" rx="12" fill="#000000" stroke="#dc2626" stroke-width="3"/>
          <text x="250" y="85" font-family="'Impact', sans-serif" font-size="64" font-weight="900" fill="#ffffff" text-anchor="middle">H K S <tspan fill="#dc2626">POWER</tspan></text>
          <!-- BRIDE -->
          <rect x="30" y="130" width="440" height="90" rx="12" fill="#000000" stroke="#00f3ff" stroke-width="3"/>
          <text x="250" y="195" font-family="'Arial Black', sans-serif" font-size="54" font-weight="900" fill="#00f3ff" text-anchor="middle" letter-spacing="8">BRIDE</text>
          <!-- RAYS VOLK RACING -->
          <rect x="30" y="240" width="440" height="90" rx="12" fill="#000000" stroke="#f59e0b" stroke-width="3"/>
          <text x="250" y="295" font-family="'Impact', sans-serif" font-size="44" font-weight="900" fill="#f59e0b" text-anchor="middle">VOLK RACING</text>
          <text x="250" y="322" font-family="sans-serif" font-size="18" font-weight="700" fill="#ffffff" text-anchor="middle">RAYS WHEELS JAPAN</text>
        </g>
      </svg>
    `)
  },
  {
    id: 'preset_racing_number_01',
    name: 'Super GT Race Plate #01',
    category: 'Sponsors & Badges',
    url: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="350" height="350" viewBox="0 0 350 350">
        <rect width="350" height="350" rx="30" fill="#ffffff" stroke="#0f172a" stroke-width="12"/>
        <rect x="20" y="20" width="310" height="70" rx="15" fill="#39c5bb"/>
        <text x="175" y="65" font-family="'Impact', sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle">SUPER GT 300</text>
        <text x="175" y="265" font-family="'Impact', sans-serif" font-size="180" font-weight="900" fill="#ff007f" text-anchor="middle">01</text>
        <text x="175" y="325" font-family="sans-serif" font-size="20" font-weight="900" fill="#0f172a" text-anchor="middle">MIKU RACING</text>
      </svg>
    `)
  },

  // 4. GRAPHIC LIVERY & WRAP PATTERNS
  {
    id: 'preset_speed_tribal_flow',
    name: 'Itasha Speed Wave Tribal',
    category: 'Graphic Livery',
    url: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
        <defs>
          <linearGradient id="tribalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ff007f"/>
            <stop offset="50%" stop-color="#00f3ff"/>
            <stop offset="100%" stop-color="#39c5bb"/>
          </linearGradient>
        </defs>
        <!-- Sharp Speed Stripes -->
        <polygon points="0,50 650,20 800,120 150,150" fill="url(#tribalGrad)"/>
        <polygon points="50,180 750,150 700,240 0,270" fill="#00f3ff"/>
        <polygon points="100,290 800,260 750,340 50,370" fill="#ff007f"/>
        <circle cx="450" cy="180" r="60" fill="#ffffff" opacity="0.9"/>
        <polygon points="450,130 520,220 380,220" fill="#0f172a"/>
      </svg>
    `)
  },
  {
    id: 'preset_sakura_petals_flow',
    name: 'Floating Sakura Petals & Wave',
    category: 'Graphic Livery',
    url: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
        <defs>
          <radialGradient id="sakuraGrad">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="70%" stop-color="#ffb7c5"/>
            <stop offset="100%" stop-color="#ff007f"/>
          </radialGradient>
        </defs>
        <!-- Wave Swirl -->
        <path d="M 0,500 Q 200,250 400,450 T 600,200" stroke="#ffb7c5" stroke-width="12" fill="none" opacity="0.5"/>
        <path d="M 0,350 Q 250,150 450,350 T 600,100" stroke="#ffffff" stroke-width="6" fill="none" opacity="0.7"/>
        <!-- 5-Petal Cherry Blossom 1 -->
        <g transform="translate(200, 200) scale(1.2)">
          <path d="M 0,0 C -25,-45 25,-45 0,0" fill="url(#sakuraGrad)"/>
          <path d="M 0,0 C 45,-25 45,25 0,0" fill="url(#sakuraGrad)"/>
          <path d="M 0,0 C 25,45 -25,45 0,0" fill="url(#sakuraGrad)"/>
          <path d="M 0,0 C -45,25 -45,-25 0,0" fill="url(#sakuraGrad)"/>
          <circle cx="0" cy="0" r="8" fill="#ff007f"/>
        </g>
        <!-- Blossom 2 -->
        <g transform="translate(420, 150) rotate(35) scale(0.9)">
          <path d="M 0,0 C -25,-45 25,-45 0,0" fill="url(#sakuraGrad)"/>
          <path d="M 0,0 C 45,-25 45,25 0,0" fill="url(#sakuraGrad)"/>
          <path d="M 0,0 C 25,45 -25,45 0,0" fill="url(#sakuraGrad)"/>
          <path d="M 0,0 C -45,25 -45,-25 0,0" fill="url(#sakuraGrad)"/>
          <circle cx="0" cy="0" r="6" fill="#ff007f"/>
        </g>
        <!-- Small Flying Petals -->
        <path d="M 100,120 C 80,90 120,90 100,120" fill="#ffb7c5"/>
        <path d="M 320,380 C 300,350 340,350 320,380" fill="#ffb7c5"/>
        <path d="M 500,480 C 480,450 520,450 500,480" fill="#ffb7c5"/>
        <text x="300" y="550" font-family="'Yu Mincho', serif" font-size="42" font-weight="900" fill="#ff007f" text-anchor="middle">夜桜 幻影</text>
      </svg>
    `)
  },
  {
    id: 'preset_cyber_hex_matrix',
    name: 'Cyberpunk Hex Grid Matrix',
    category: 'Graphic Livery',
    url: makeSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
        <pattern id="hexGrid" width="60" height="104" patternUnits="userSpaceOnUse">
          <path d="M 30,0 L 60,17 L 60,52 L 30,69 L 0,52 L 0,17 Z" fill="none" stroke="#00f3ff" stroke-width="2" opacity="0.4"/>
          <path d="M 30,52 L 60,69 L 60,104 L 30,121 L 0,104 L 0,69 Z" fill="none" stroke="#ff007f" stroke-width="2" opacity="0.4"/>
        </pattern>
        <rect width="600" height="600" fill="url(#hexGrid)"/>
        <polygon points="0,0 600,600 500,600 0,100" fill="#00f3ff" opacity="0.6"/>
        <polygon points="600,0 0,600 100,600 600,100" fill="#ff007f" opacity="0.6"/>
      </svg>
    `)
  }
];

// ==========================================
// COMPLETE FULL-BODY WRAP TEMPLATES (痛車 TEMPLATES)
// ==========================================

export const ITA_WRAP_TEMPLATES = [
  {
    id: 'miku_super_gt',
    name: 'GoodSmile Hatsune Miku Racing 2024 (Official Super GT Style)',
    tagline: 'Signature Turquoise & Neon Pink GT300 Champion Wrap',
    bodyColor: '#39c5bb',
    finishKey: 'GLOSS',
    badge: '🏆 GT300 Miku',
    accentColor: '#39c5bb',
    layers: {
      hood: [
        {
          id: 'wrap_miku_hood_hero',
          name: 'Racing Miku 2024 Centerpiece',
          imageUrl: DECAL_PRESETS[0].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.45, scale: 0.85, rotation: 0, flipH: false, flipV: false }
        },
        {
          id: 'wrap_miku_hood_kanji',
          name: 'Kanji "初音ミク"',
          imageUrl: DECAL_PRESETS[4].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.85, scale: 0.65, rotation: 0, flipH: false, flipV: false }
        }
      ],
      door_l: [
        {
          id: 'wrap_miku_doorl_hero',
          name: 'Racing Miku Side Hero',
          imageUrl: DECAL_PRESETS[0].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.45, posY: 0.45, scale: 0.85, rotation: -8, flipH: false, flipV: false }
        },
        {
          id: 'wrap_miku_doorl_num',
          name: 'Super GT Race Plate #01',
          imageUrl: DECAL_PRESETS[8].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.8, posY: 0.45, scale: 0.45, rotation: 0, flipH: false, flipV: false }
        },
        {
          id: 'wrap_miku_doorl_tribal',
          name: 'Speed Wave Tribal',
          imageUrl: DECAL_PRESETS[9].url,
          visible: true,
          opacity: 0.8,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.75, scale: 0.9, rotation: 5, flipH: false, flipV: false }
        }
      ],
      door_r: [
        {
          id: 'wrap_miku_doorr_hero',
          name: 'Racing Miku Side Hero (Mirrored)',
          imageUrl: DECAL_PRESETS[0].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.55, posY: 0.45, scale: 0.85, rotation: 8, flipH: true, flipV: false }
        },
        {
          id: 'wrap_miku_doorr_num',
          name: 'Super GT Race Plate #01',
          imageUrl: DECAL_PRESETS[8].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.2, posY: 0.45, scale: 0.45, rotation: 0, flipH: false, flipV: false }
        },
        {
          id: 'wrap_miku_doorr_tribal',
          name: 'Speed Wave Tribal',
          imageUrl: DECAL_PRESETS[9].url,
          visible: true,
          opacity: 0.8,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.75, scale: 0.9, rotation: -5, flipH: true, flipV: false }
        }
      ],
      roof: [
        {
          id: 'wrap_miku_roof_kanji',
          name: 'Kanji "痛車" Big Itasha Decal',
          imageUrl: DECAL_PRESETS[3].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.85, rotation: 90, flipH: false, flipV: false }
        }
      ],
      // For motorcycles
      tank: [
        {
          id: 'wrap_miku_tank',
          name: 'Racing Miku Tank Crest',
          imageUrl: DECAL_PRESETS[0].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.45, scale: 0.8, rotation: 0, flipH: false, flipV: false }
        }
      ],
      fairing_l: [
        {
          id: 'wrap_miku_fairingl',
          name: 'GoodSmile Racing Decal L',
          imageUrl: DECAL_PRESETS[6].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.75, rotation: 0, flipH: false, flipV: false }
        }
      ],
      fairing_r: [
        {
          id: 'wrap_miku_fairingr',
          name: 'GoodSmile Racing Decal R',
          imageUrl: DECAL_PRESETS[6].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.75, rotation: 0, flipH: true, flipV: false }
        }
      ],
      fairing_f: [
        {
          id: 'wrap_miku_fairingf',
          name: 'Miku Number 01',
          imageUrl: DECAL_PRESETS[8].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.7, rotation: 0, flipH: false, flipV: false }
        }
      ]
    }
  },
  {
    id: 'cyberpunk_2077',
    name: 'Cyberpunk 2077 Neo-Tokyo Night City',
    tagline: 'Obsidian Black, Neon Magenta & Hex Grid Matrix',
    bodyColor: '#0a0d14',
    finishKey: 'MATTE',
    badge: '⚡ Cyberpunk',
    accentColor: '#00f3ff',
    layers: {
      hood: [
        {
          id: 'wrap_cyber_hood',
          name: 'Cyber Anime Pilot',
          imageUrl: DECAL_PRESETS[1].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.45, scale: 0.85, rotation: 0, flipH: false, flipV: false }
        }
      ],
      door_l: [
        {
          id: 'wrap_cyber_doorl_grid',
          name: 'Cyber Hex Grid Matrix',
          imageUrl: DECAL_PRESETS[11].url,
          visible: true,
          opacity: 0.6,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.9, rotation: 0, flipH: false, flipV: false }
        },
        {
          id: 'wrap_cyber_doorl_hero',
          name: 'Cyberpunk Heroine',
          imageUrl: DECAL_PRESETS[1].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.8, rotation: 0, flipH: false, flipV: false }
        }
      ],
      door_r: [
        {
          id: 'wrap_cyber_doorr_grid',
          name: 'Cyber Hex Grid Matrix',
          imageUrl: DECAL_PRESETS[11].url,
          visible: true,
          opacity: 0.6,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.9, rotation: 0, flipH: true, flipV: false }
        },
        {
          id: 'wrap_cyber_doorr_hero',
          name: 'Cyberpunk Heroine',
          imageUrl: DECAL_PRESETS[1].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.8, rotation: 0, flipH: true, flipV: false }
        }
      ],
      tank: [
        {
          id: 'wrap_cyber_tank',
          name: 'Cyber Hex Pilot',
          imageUrl: DECAL_PRESETS[1].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.8, rotation: 0, flipH: false, flipV: false }
        }
      ],
      fairing_l: [
        {
          id: 'wrap_cyber_fl',
          name: 'Hex Matrix L',
          imageUrl: DECAL_PRESETS[11].url,
          visible: true,
          opacity: 0.8,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.8, rotation: 0, flipH: false, flipV: false }
        }
      ],
      fairing_r: [
        {
          id: 'wrap_cyber_fr',
          name: 'Hex Matrix R',
          imageUrl: DECAL_PRESETS[11].url,
          visible: true,
          opacity: 0.8,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.8, rotation: 0, flipH: true, flipV: false }
        }
      ]
    }
  },
  {
    id: 'sakura_blossom',
    name: 'Sakura Petals Hanamizuki (Traditional Japanese)',
    tagline: 'Hot Pink Pearl, Floating Sakura Petals & Wave Art',
    bodyColor: '#ff007f',
    finishKey: 'PEARL',
    badge: '🌸 Sakura Drift',
    accentColor: '#ffb7c5',
    layers: {
      hood: [
        {
          id: 'wrap_sakura_hood',
          name: 'Floating Sakura Petals',
          imageUrl: DECAL_PRESETS[10].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.9, rotation: 0, flipH: false, flipV: false }
        }
      ],
      door_l: [
        {
          id: 'wrap_sakura_doorl',
          name: 'Sakura Flow Waves',
          imageUrl: DECAL_PRESETS[10].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.9, rotation: 15, flipH: false, flipV: false }
        }
      ],
      door_r: [
        {
          id: 'wrap_sakura_doorr',
          name: 'Sakura Flow Waves',
          imageUrl: DECAL_PRESETS[10].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.9, rotation: -15, flipH: true, flipV: false }
        }
      ],
      tank: [
        {
          id: 'wrap_sakura_tank',
          name: 'Sakura Crest',
          imageUrl: DECAL_PRESETS[10].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.85, rotation: 0, flipH: false, flipV: false }
        }
      ]
    }
  },
  {
    id: 'akina_drift',
    name: 'Touge Akina SpeedStars (Initial D Style)',
    tagline: 'Panda Monotone White/Black & JDM Fujiwara Livery',
    bodyColor: '#f8fafc',
    finishKey: 'GLOSS',
    badge: '🏔️ Akina Touge',
    accentColor: '#000000',
    layers: {
      door_r: [
        {
          id: 'wrap_akina_doorr',
          name: 'Fujiwara Tofu Shop Kanji',
          imageUrl: DECAL_PRESETS[5].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.8, rotation: 0, flipH: false, flipV: false }
        }
      ],
      door_l: [
        {
          id: 'wrap_akina_doorl',
          name: 'Godspeed Touge Kanji',
          imageUrl: DECAL_PRESETS[6].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.8, rotation: 0, flipH: false, flipV: false }
        }
      ],
      hood: [
        {
          id: 'wrap_akina_hood',
          name: 'JDM Tuner Sponsors Grid',
          imageUrl: DECAL_PRESETS[7].url,
          visible: true,
          opacity: 1.0,
          blendMode: 'source-over',
          lassoPoints: [],
          transform: { posX: 0.5, posY: 0.5, scale: 0.75, rotation: 0, flipH: false, flipV: false }
        }
      ]
    }
  }
];
