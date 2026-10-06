import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_NAME } from "./site-config";

export const alt = "Oryvelle — Quiet your restless mind. Sounds, meditation and breathing on Android.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = readFile(join(process.cwd(), "app/_assets/fonts/outfit-light.ttf"));
const mark = readFile(join(process.cwd(), "public/opening/oryvelle-mark.svg"), "utf8");

const constellation = [[843, 119], [966, 191], [885, 300], [1090, 350], [1145, 224]];
const starfield = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><radialGradient id="glow"><stop stop-color="#d9d2f2" stop-opacity=".55"/><stop offset="1" stop-color="#b6b9e8" stop-opacity="0"/></radialGradient></defs>
  ${Array.from({ length: 85 }, (_, i) => {
    const x = (i * 137 + 37) % 1200;
    const y = (i * 89 + 23) % 630;
    return `<circle cx="${x}" cy="${y}" r="${i % 7 === 0 ? 1.2 : .65}" fill="#d5cee3" opacity="${i % 7 === 0 ? .4 : .18}"/>`;
  }).join("")}
  <polyline points="${constellation.map(point => point.join(",")).join(" ")}" fill="none" stroke="#c8c0e0" stroke-opacity=".14" stroke-width="1"/>
  ${constellation.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="17" fill="url(#glow)"/><circle cx="${x}" cy="${y}" r="1.6" fill="#e5dff6" opacity=".85"/>`).join("")}
  <path d="M48 450 L142 400 L257 490 L356 441" fill="none" stroke="#a3c3d7" stroke-opacity=".08"/>
</svg>`;

export default async function Image() {
  const [fontData, markSvg] = await Promise.all([font, mark]);
  const logo = `data:image/svg+xml;base64,${Buffer.from(markSvg.replaceAll("currentColor", "#d3cddd")).toString("base64")}`;

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "radial-gradient(ellipse at 95% 55%, #39334f 0%, #171b2b 42%, #0b0e18 78%)", color: "#d3cddd", fontFamily: "Outfit", fontWeight: 300 }}>
      {/* ImageResponse renders SVG assets directly; no browser or remote fetch is needed. */}
      <img src={`data:image/svg+xml;base64,${Buffer.from(starfield).toString("base64")}`} width={1200} height={630} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, position: "absolute", top: 48, right: 58 }}>
          <img src={logo} width={43} height={43} alt="" />
        <span style={{ fontSize: 38, letterSpacing: -1.5 }}>{SITE_NAME}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", position: "absolute", top: 170, left: 64 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 100, lineHeight: 1.06, letterSpacing: -4 }}>
          <span>Quiet your</span>
          <span>restless mind.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 30, fontSize: 27, lineHeight: 1.4, color: "#b4adca" }}>
          <span>Sounds, meditation and breathing.</span>
          <span>An evening routine at your own pace.</span>
        </div>
      </div>
      <div style={{ display: "flex", position: "absolute", bottom: 45, left: 64, fontSize: 20, color: "#938da5" }}>Available on Android</div>
      <div style={{ display: "flex", position: "absolute", bottom: 45, right: 58, fontSize: 20, color: "#b4adca" }}>oryvelle.app</div>
    </div>,
    { ...size, fonts: [{ name: "Outfit", data: fontData, weight: 300, style: "normal" }] },
  );
}
