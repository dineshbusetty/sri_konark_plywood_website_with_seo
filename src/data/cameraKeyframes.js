// Each act defines camera keyframes as [scrollProgress, position[x,y,z], lookAt[x,y,z], fov]
// scrollProgress is global 0-1 across entire page

export const ACTS = [
  { id: 'forest',    label: 'Forest',     start: 0,     end: 0.107  },  // 0–300vh of ~2800vh
  { id: 'workshop',  label: 'Workshop',   start: 0.107, end: 0.196  },  // 300–550vh
  { id: 'showroom',  label: 'Showroom',   start: 0.196, end: 0.304  },  // 550–850vh
  { id: 'home',      label: 'Home',       start: 0.304, end: 0.839  },  // 850–2350vh
  { id: 'storefront',label: 'Storefront', start: 0.839, end: 1.0    },  // 2350–2800vh
]

export const TOTAL_SCROLL_HEIGHT = 2800

export const HOME_ROOMS = [
  { id: 'living-room',   start: 0.304, end: 0.380 },
  { id: 'kitchen',       start: 0.380, end: 0.457 },
  { id: 'bedroom',       start: 0.457, end: 0.533 },
  { id: 'bathroom',      start: 0.533, end: 0.610 },
  { id: 'dining-room',   start: 0.610, end: 0.686 },
  { id: 'study',         start: 0.686, end: 0.763 },
  { id: 'pooja-room',    start: 0.763, end: 0.839 },
]

export const CAMERA_KEYFRAMES = [
  // === ACT 1: FOREST — crane descent through canopy, dolly forward ===
  { p: 0.00,  pos: [0, 20, 30],   lookAt: [0, 5, 0],    fov: 50 },
  { p: 0.03,  pos: [1, 14, 22],   lookAt: [0, 4, 0],    fov: 48 },
  { p: 0.05,  pos: [0.5, 8, 15],  lookAt: [0, 3, -2],   fov: 45 },
  { p: 0.07,  pos: [0, 5, 8],     lookAt: [0, 2.5, -3], fov: 42 },
  { p: 0.09,  pos: [-0.5, 3.5, 3],lookAt: [0, 2, -5],   fov: 40 },
  { p: 0.107, pos: [0, 3, -2],    lookAt: [0, 2, -8],   fov: 38 },

  // === ACT 2: WORKSHOP — push through doors, drop to workbench level ===
  { p: 0.11,  pos: [0, 3, -5],    lookAt: [0, 1.8, -12],  fov: 42 },
  { p: 0.13,  pos: [0, 2.5, -8],  lookAt: [0, 1.5, -15],  fov: 45 },
  { p: 0.15,  pos: [0.5, 2, -11], lookAt: [1, 1.2, -16],  fov: 48 },
  { p: 0.17,  pos: [1, 1.6, -13], lookAt: [0, 1.3, -18],  fov: 46 },
  { p: 0.196, pos: [0, 1.5, -16], lookAt: [-1, 1.5, -22], fov: 44 },

  // === ACT 3: SHOWROOM — lateral tracking past display walls ===
  { p: 0.20,  pos: [-6, 2.5, -22], lookAt: [-4, 2, -28],  fov: 50 },
  { p: 0.23,  pos: [-3, 2.5, -25], lookAt: [-1, 2, -30],  fov: 48 },
  { p: 0.25,  pos: [0, 2.5, -27],  lookAt: [2, 2, -32],   fov: 48 },
  { p: 0.28,  pos: [3, 2.5, -29],  lookAt: [5, 2, -34],   fov: 48 },
  { p: 0.304, pos: [5, 2.5, -31],  lookAt: [3, 2, -38],   fov: 46 },

  // === ACT 4: HOME — forward dolly through rooms ===
  // Living Room
  { p: 0.31,  pos: [0, 2.2, -35], lookAt: [0, 1.8, -42],  fov: 50 },
  { p: 0.35,  pos: [0, 2, -39],   lookAt: [0.5, 1.6, -46],fov: 48 },
  { p: 0.38,  pos: [0, 2, -43],   lookAt: [0, 1.8, -50],  fov: 46 },
  // Kitchen
  { p: 0.40,  pos: [0, 2, -47],   lookAt: [1, 1.5, -54],  fov: 50 },
  { p: 0.43,  pos: [0.5, 1.8, -51],lookAt: [0, 1.5, -58], fov: 48 },
  { p: 0.457, pos: [0, 2, -55],   lookAt: [-0.5, 1.8, -62],fov: 46 },
  // Bedroom
  { p: 0.47,  pos: [0, 2.2, -59], lookAt: [0, 1.6, -66],  fov: 50 },
  { p: 0.50,  pos: [0.3, 2, -63], lookAt: [0, 1.8, -70],  fov: 48 },
  { p: 0.533, pos: [0, 2, -67],   lookAt: [0.5, 1.6, -74],fov: 46 },
  // Bathroom
  { p: 0.55,  pos: [0, 2, -71],   lookAt: [0, 1.5, -78],  fov: 48 },
  { p: 0.58,  pos: [0, 1.8, -75], lookAt: [0.3, 1.5, -82],fov: 46 },
  { p: 0.610, pos: [0, 2, -79],   lookAt: [0, 1.8, -86],  fov: 46 },
  // Dining Room
  { p: 0.63,  pos: [0, 2.2, -83], lookAt: [0.5, 1.6, -90],fov: 50 },
  { p: 0.66,  pos: [0, 2, -87],   lookAt: [0, 1.8, -94],  fov: 48 },
  { p: 0.686, pos: [0, 2, -91],   lookAt: [-0.5, 1.6, -98],fov: 46 },
  // Study
  { p: 0.70,  pos: [0, 2, -95],   lookAt: [0, 1.5, -102], fov: 48 },
  { p: 0.73,  pos: [0.3, 1.8, -99],lookAt: [0, 1.5, -106],fov: 46 },
  { p: 0.763, pos: [0, 2, -103],  lookAt: [0.5, 1.8, -110],fov: 46 },
  // Pooja Room
  { p: 0.78,  pos: [0, 2.2, -107],lookAt: [0, 1.6, -114], fov: 48 },
  { p: 0.81,  pos: [0, 2, -111],  lookAt: [0, 1.8, -118], fov: 46 },
  { p: 0.839, pos: [0, 2, -115],  lookAt: [0, 2, -122],   fov: 44 },

  // === ACT 5: STOREFRONT — reverse dolly, crane up ===
  { p: 0.86,  pos: [0, 2.5, -118],lookAt: [0, 2.5, -125], fov: 46 },
  { p: 0.90,  pos: [0, 3.5, -122],lookAt: [0, 2.5, -130], fov: 50 },
  { p: 0.95,  pos: [0, 4, -126],  lookAt: [0, 3, -135],   fov: 52 },
  { p: 1.00,  pos: [0, 4.5, -128],lookAt: [0, 3, -138],   fov: 50 },
]
