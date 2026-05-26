const CDN = "https://gmyplyxwxmkvptimzgid.supabase.co/storage/v1/object/public/Assets";

const GAME       = `${CDN}/Game%20assets`;
const ELEMENTALS = `${CDN}/Elementals`;
const SHARDS     = `${CDN}/Shards`;
const ITEMS      = `${CDN}/Items`;
const LOGO_FOLDER = `${CDN}/Logo`;
const ART        = `${CDN}/Art`;

// ── Logo ──────────────────────────────────────────────────────────────────────
export const LOGO = `${LOGO_FOLDER}/logo.jpg`;

// ── Art / hero images ─────────────────────────────────────────────────────────
export const ART_IMAGES = {
  hero1: `${ART}/Earnity-1.jpg`,
  hero2: `${ART}/Earnity-2.jpg`,
  hero3: `${ART}/Earnity-3.jpg`,
} as const;

// ── Game assets ───────────────────────────────────────────────────────────────
export const GAME_ASSETS = {
  background1:      `${GAME}/background-1.png`,
  background2:      `${GAME}/background-2.png`,
  seal1:            `${GAME}/Seal1.png`,
  seal2:            `${GAME}/Seal2.png`,
  mysteryboxClosed: `${GAME}/mysterybox-closed.png`,
  mysteryboxOpened: `${GAME}/mysterybox-opened.png`,
  itemboxClosed:    `${GAME}/itembox-closed.png`,
  itemboxOpened:    `${GAME}/itembox-opened.png`,
  coin:             `${GAME}/coin.png`,
  coins200:         `${GAME}/200-coins.png`,
  coins1000:        `${GAME}/1000-coins.png`,
} as const;

// ── Elemental images ──────────────────────────────────────────────────────────
export const ELEMENTAL_IMAGES = {
  fire:      `${ELEMENTALS}/Fire.png`,
  water:     `${ELEMENTALS}/Water.png`,
  nature:    `${ELEMENTALS}/Nature.png`,
  rock:      `${ELEMENTALS}/Rock.png`,
  lightning: `${ELEMENTALS}/Lightning.png`,
  wind:      `${ELEMENTALS}/Wind.png`,
} as const;

// ── Elemental shards ──────────────────────────────────────────────────────────
export const SHARD_IMAGES = {
  fire:      `${SHARDS}/fire-shard.png`,
  water:     `${SHARDS}/water-shard.png`,
  nature:    `${SHARDS}/nature-shard.png`,
  rock:      `${SHARDS}/rock-shard.png`,
  lightning: `${SHARDS}/lightning-shard.png`,
  wind:      `${SHARDS}/wind-shard.png`,
  ice:       `${SHARDS}/ice-shard.png`,
} as const;

// ── Items ─────────────────────────────────────────────────────────────────────
export const ITEM_IMAGES = {
  nuke:     `${ITEMS}/Nuke.png`,
  drain:    `${ITEMS}/Drain.png`,
  rug:      `${ITEMS}/RUG.png`,
  shield:   `${ITEMS}/Shield.png`,
  hpPotion: `${ITEMS}/HP.png`,
  mpPotion: `${ITEMS}/MP.png`,
} as const;

// ── Element metadata (4 WL elements) ─────────────────────────────────────────
export const ELEMENT_META: Record<string, {
  label: string; text: string; border: string; bg: string; glow: string; img: string; shard: string;
}> = {
  fire: {
    label: "Fire", text: "text-orange-400", border: "border-orange-500/50",
    bg: "bg-orange-500/15", glow: "rgba(249,115,22,0.3)",
    img: ELEMENTAL_IMAGES.fire, shard: SHARD_IMAGES.fire,
  },
  water: {
    label: "Water", text: "text-blue-400", border: "border-blue-500/50",
    bg: "bg-blue-500/15", glow: "rgba(59,130,246,0.3)",
    img: ELEMENTAL_IMAGES.water, shard: SHARD_IMAGES.water,
  },
  nature: {
    label: "Nature", text: "text-green-400", border: "border-green-500/50",
    bg: "bg-green-500/15", glow: "rgba(34,197,94,0.3)",
    img: ELEMENTAL_IMAGES.nature, shard: SHARD_IMAGES.nature,
  },
  lightning: {
    label: "Lightning", text: "text-yellow-400", border: "border-yellow-400/50",
    bg: "bg-yellow-400/15", glow: "rgba(250,204,21,0.3)",
    img: ELEMENTAL_IMAGES.lightning, shard: SHARD_IMAGES.lightning,
  },
};
