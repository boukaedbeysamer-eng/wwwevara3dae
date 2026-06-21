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

          {/* 3D Medal with hanger ribbon */}
          <div className="relative z-10 flex flex-1 items-center justify-center px-6">
            <svg viewBox="0 0 200 220" className="w-[70%]">
              <defs>
                <radialGradient id="medalGrad" cx="40%" cy="35%" r="70%">
                  <stop offset="0%" stopColor={track} stopOpacity="1" />
                  <stop offset="55%" stopColor={track} stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
                </radialGradient>
                <radialGradient id="medalInner" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor={relief} stopOpacity="1" />
                  <stop offset="100%" stopColor={relief} stopOpacity="0.7" />
                </radialGradient>
                <linearGradient id="ribbonGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={track} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={track} stopOpacity="0.55" />
                </linearGradient>
              </defs>

              {/* Hanger ribbon - inverted V */}
              <polygon points="70,5 100,95 130,5 115,5 100,75 85,5" fill="url(#ribbonGrad)" />
              <polygon points="70,5 85,5 100,75" fill="#000" opacity="0.18" />

              {/* Ribbon loop ring */}
              <circle cx="100" cy="90" r="8" fill="none" stroke="#333" strokeWidth="2" opacity="0.5" />

              {/* Medal 3D */}
              <circle cx="100" cy="145" r="60" fill="url(#medalGrad)" />
              <circle cx="100" cy="145" r="60" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
              <circle cx="100" cy="145" r="46" fill="url(#medalInner)" stroke={reliefOutline} strokeOpacity="0.4" strokeWidth="1" />
              <ellipse cx="100" cy="208" rx="42" ry="4" fill="#000" opacity="0.18" />

              {/* route on medal face */}
              <path
                d="M70,160 C82,135 100,148 112,135 C124,122 132,140 142,128"
                fill="none"
                stroke={reliefOutline}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d="M68,168 C84,148 96,156 110,140 C124,124 138,132 144,120"
                fill="none"
                stroke={track}
                strokeWidth="2.4"
                strokeLinecap="round"
              />

              {/* gloss */}
              <ellipse cx="80" cy="120" rx="22" ry="10" fill="#fff" opacity="0.22" />
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
                    {value || label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
