import type { FrameFinish, MapColor, TrackColor } from "@/data/products";

export type FrameDetails = {
  raceName?: string;
  customerName?: string;
  date?: string;
  distance?: string;
  time?: string;
  location?: string;
  elevation?: string;
};

const FRAME_COLOR: Record<FrameFinish, string> = {
  "White Matt": "#f4f2ee",
  "Matte Black": "#111111",
  Wooden: "#8a5a2b",
};

const RELIEF_COLOR: Record<MapColor, string> = {
  Black: "#111111",
  White: "#ffffff",
  Green: "#4a7c59",
  Wooden: "#a26a36",
};

// Choose contrasting stroke for the route line drawn inside hexagon
const RELIEF_STROKE: Record<MapColor, string> = {
  Black: "#ffffff",
  White: "#111111",
  Green: "#ffffff",
  Wooden: "#ffffff",
};

const TRACK_COLOR_HEX: Record<TrackColor, string> = {
  Red: "#c0392b",
  Black: "#111111",
  Orange: "#d97706",
};

export function DynamicFrameSample({
  frameFinish,
  mapColor,
  trackColor,
  raceName = "TITLE HERE",
  customerName = "YOUR NAME HERE",
  date = "DATE",
  distance = "DISTANCE",
  time = "TIME",
  location = "LOCATION",
  elevation = "ELEVATION",
}: {
  frameFinish: FrameFinish;
  mapColor: MapColor;
  trackColor: TrackColor;
} & FrameDetails) {
  const frame = FRAME_COLOR[frameFinish];
  const relief = RELIEF_COLOR[mapColor];
  const reliefOutline = RELIEF_STROKE[mapColor];
  const track = TRACK_COLOR_HEX[trackColor];
  const textColor = frameFinish === "Matte Black" ? "#f4f2ee" : "#111111";

  return (
    <div
      className="mx-auto w-full max-w-[420px] shadow-2xl"
      style={{
        backgroundColor: frame,
        padding: "18px",
        aspectRatio: "3 / 4.2",
      }}
    >
        <div
          className="relative flex h-full w-full flex-col overflow-hidden"
          style={{ backgroundColor: "#fafaf7" }}
        >
          {/* clean white background */}
          <div className="absolute inset-0 h-full w-full" style={{ backgroundColor: "#fafaf7" }} />

          {/* Title + name */}
          <div className="relative z-10 px-6 pt-7 text-center" style={{ color: textColor }}>
            <div
              className="break-words font-display tracking-wider"
              style={{ fontSize: "26px", lineHeight: 1, letterSpacing: "0.04em" }}
            >
              {raceName}
            </div>
            <div
              className="mt-2 break-words text-[10px] tracking-[0.32em]"
              style={{ color: textColor, opacity: 0.85 }}
            >
              {customerName}
            </div>
          </div>

          {/* Two hexagon shapes: original black hexagon + medal hanger hexagon */}
          <div className="relative z-10 flex flex-1 items-center justify-center px-6">
            <svg viewBox="0 0 280 160" className="w-[78%]">
              <defs>
                <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={relief} stopOpacity="1" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="hangerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={track} stopOpacity="1" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Left: original black hexagon (relief/map) */}
              <g transform="translate(80, 80)">
                <polygon
                  points="0,-58 50.2,-29 50.2,29 0,58 -50.2,29 -50.2,-29"
                  fill="url(#hexGrad)"
                  stroke={reliefOutline}
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                />
                {/* route line inside left hexagon */}
                <path
                  d="M-32,16 C-16,-10 0,6 16,-10 C32,-26 40,-8 46,-18"
                  fill="none"
                  stroke={reliefOutline}
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                <path
                  d="M-34,24 C-18,2 0,12 14,-6 C28,-24 42,-16 48,-26"
                  fill="none"
                  stroke={track}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                {/* gloss */}
                <ellipse cx="-12" cy="-26" rx="16" ry="7" fill="#ffffff" opacity="0.18" />
              </g>

              {/* Right: medal hanger hexagon (separate object) */}
              <g transform="translate(200, 80)">
                {/* Ribbon hanger */}
                <polygon points="-18,-58 0,-16 18,-58 10,-58 0,-30 -10,-58" fill="url(#hangerGrad)" />
                <polygon points="-18,-58 -10,-58 0,-30" fill="#000000" opacity="0.18" />
                {/* Ribbon loop ring */}
                <circle cx="0" cy="-16" r="5" fill="none" stroke="#333333" strokeWidth="1.5" opacity="0.5" />

                {/* Hexagon medal */}
                <polygon
                  points="0,-44 38.1,-22 38.1,22 0,44 -38.1,22 -38.1,-22"
                  fill="url(#hangerGrad)"
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeOpacity="0.35"
                />
                {/* Inner hexagon face */}
                <polygon
                  points="0,-28 24.2,-14 24.2,14 0,28 -24.2,14 -24.2,-14"
                  fill={relief}
                  stroke={reliefOutline}
                  strokeOpacity="0.4"
                  strokeWidth="1"
                />
                {/* route line on hanger hexagon */}
                <path
                  d="M-22,14 C-12,-4 0,4 12,-8 C22,-18 28,-6 32,-12"
                  fill="none"
                  stroke={reliefOutline}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                <path
                  d="M-24,20 C-14,4 0,10 10,-2 C20,-14 30,-8 34,-16"
                  fill="none"
                  stroke={track}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                {/* gloss */}
                <ellipse cx="-10" cy="-28" rx="12" ry="5" fill="#ffffff" opacity="0.22" />
                {/* ground shadow */}
                <ellipse cx="0" cy="52" rx="34" ry="3" fill="#000000" opacity="0.15" />
              </g>
            </svg>
          </div>

          {/* Stats single row */}
          <div className="relative z-10 px-3 pb-5" style={{ color: textColor }}>
            <div className="flex items-start justify-between gap-1.5 text-center">
              {[
                { label: "DATE", value: date },
                { label: "DISTANCE", value: distance },
                { label: "TIME", value: time },
                { label: "LOCATION", value: location },
                { label: "ELEVATION", value: elevation },
              ].map(({ label, value }) => (
                <div key={label} className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
                  <span className="text-[6px] tracking-[0.14em] opacity-75">{label}</span>
                  <span className="max-w-full truncate text-[8px] font-semibold tracking-[0.04em]">
                    {value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
