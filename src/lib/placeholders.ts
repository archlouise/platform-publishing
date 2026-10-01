/**
 * Deterministic, locally generated placeholder imagery. Nothing here
 * depends on a remote host, so the demo never shows a broken image.
 */
import { initials } from "./utils";

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function svgUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}

/** Muted palette for people and firms, chosen by hash of the seed. */
const AVATAR_HUES = [195, 210, 165, 25, 40, 260, 340, 120, 15, 230];

export function avatarUri(name: string, seed = name) {
  const hue = AVATAR_HUES[hash(seed) % AVATAR_HUES.length];
  const text = initials(name);
  return svgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <rect width="96" height="96" fill="hsl(${hue} 22% 88%)"/>
      <text x="48" y="48" dy="0.36em" text-anchor="middle"
        font-family="Archivo, Helvetica, Arial, sans-serif" font-size="36" font-weight="600"
        fill="hsl(${hue} 30% 32%)">${text}</text>
    </svg>`);
}

export function logoUri(name: string, seed = name) {
  const hue = AVATAR_HUES[hash(seed) % AVATAR_HUES.length];
  const text = initials(name);
  return svgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <rect width="96" height="96" rx="14" fill="hsl(${hue} 28% 26%)"/>
      <text x="48" y="48" dy="0.36em" text-anchor="middle"
        font-family="Archivo, Helvetica, Arial, sans-serif" font-size="34" font-weight="700"
        fill="hsl(${hue} 30% 92%)">${text}</text>
    </svg>`);
}

/**
 * A project cover drawn as a simple elevation: a skyline of blocks with
 * a window grid, sized and coloured by the seed. Reads like a drawing,
 * not a stock photo.
 */
export function projectHeroUri(seed: string, variant: "wide" | "card" = "wide") {
  const h = hash(seed);
  const hue = [195, 180, 25, 210, 40, 160, 230, 350][h % 8];
  const W = variant === "wide" ? 1600 : 800;
  const H = variant === "wide" ? 640 : 500;
  const ground = H - 70;
  const rnd = (() => {
    let x = h || 1;
    return () => {
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      return (x >>> 0) / 4294967296;
    };
  })();

  const buildings: string[] = [];
  let x = 40;
  while (x < W - 40) {
    const bw = 90 + Math.floor(rnd() * 180);
    const bh = 120 + Math.floor(rnd() * (H - 220));
    const y = ground - bh;
    const shade = 40 + Math.floor(rnd() * 25);
    buildings.push(`<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="hsl(${hue} 18% ${shade}%)"/>`);
    const cols = Math.max(2, Math.floor(bw / 36));
    const rows = Math.max(2, Math.floor(bh / 40));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rnd() < 0.18) continue;
        const wx = x + 14 + c * ((bw - 28) / cols);
        const wy = y + 16 + r * ((bh - 24) / rows);
        buildings.push(`<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="${((bw - 28) / cols - 10).toFixed(1)}" height="16" fill="hsl(${hue} 30% ${shade + 32}%)" opacity="0.9"/>`);
      }
    }
    x += bw + 18 + Math.floor(rnd() * 30);
  }

  return svgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
      <defs>
        <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="hsl(${hue} 20% 80%)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="${W}" height="${H}" fill="hsl(${hue} 24% 93%)"/>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
      ${buildings.join("")}
      <rect x="0" y="${ground}" width="${W}" height="${H - ground}" fill="hsl(${hue} 16% 36%)"/>
      <line x1="0" y1="${ground}" x2="${W}" y2="${ground}" stroke="hsl(${hue} 20% 22%)" stroke-width="3"/>
    </svg>`);
}

export function coverUri(seed: string) {
  const h = hash(seed);
  const hue = [195, 180, 25, 210, 40, 160, 230, 350][h % 8];
  return svgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 400">
      <defs>
        <pattern id="d" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="48" stroke="hsl(${hue} 20% 78%)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="1600" height="400" fill="hsl(${hue} 22% 90%)"/>
      <rect width="1600" height="400" fill="url(#d)"/>
      <rect x="0" y="330" width="1600" height="70" fill="hsl(${hue} 18% 40%)"/>
    </svg>`);
}

export function productUri(name: string, seed = name) {
  const h = hash(seed);
  const hue = [195, 180, 25, 210, 40, 160][h % 6];
  return svgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260">
      <rect width="400" height="260" fill="hsl(${hue} 20% 92%)"/>
      <rect x="70" y="60" width="260" height="140" rx="4" fill="hsl(${hue} 18% 40%)"/>
      <rect x="90" y="80" width="220" height="100" rx="2" fill="hsl(${hue} 22% 56%)"/>
      <line x1="90" y1="130" x2="310" y2="130" stroke="hsl(${hue} 20% 88%)" stroke-width="2"/>
      <line x1="200" y1="80" x2="200" y2="180" stroke="hsl(${hue} 20% 88%)" stroke-width="2"/>
    </svg>`);
}
