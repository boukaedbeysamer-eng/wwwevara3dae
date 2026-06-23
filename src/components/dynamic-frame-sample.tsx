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
  showMedal = true,
  showSecondHex = true,
  showBibSquare = false,
}: {
  frameFinish: FrameFinish;
  mapColor: MapColor;
  trackColor: TrackColor;
  showMedal?: boolean;
  showSecondHex?: boolean;
  showBibSquare?: boolean;
} & FrameDetails) {
  const frame = FRAME_COLOR[frameFinish];
  const track = TRACK_COLOR_HEX[trackColor];
  const hexFill = RELIEF_COLOR[mapColor];
  const hexStroke = mapColor === "White" ? "#111111" : "none";
  const glossColor = mapColor === "White" ? "#111111" : "#ffffff";
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
              className="break-words font-display font-bold tracking-wider"
              style={{ fontSize: "26px", lineHeight: 1, letterSpacing: "0.04em", color: "#111111" }}
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

          {/* Shapes area: hexagons + optional BIB square */}
          <div
            className={`relative z-10 flex flex-1 items-center justify-center px-6 ${showBibSquare ? "flex-col gap-3" : "flex-col"}`}
          >
            <svg viewBox="0 0 280 160" className={showBibSquare ? "w-[85%]" : "w-[96%]"} style={{ transform: showBibSquare ? "translateY(0)" : "translateY(-1cm)" }}>
              <g transform="translate(140, 80)">
                <polygon
                  points="0,-58 50.2,-29 50.2,29 0,58 -50.2,29 -50.2,-29"
                  fill={hexFill}
                  stroke={hexStroke}
                  strokeWidth="1"
                />
                <path
                  d="M-34,24 C-18,2 0,12 14,-6 C28,-24 42,-16 48,-26"
                  fill="none"
                  stroke={track}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <ellipse cx="-12" cy="-26" rx="16" ry="7" fill={glossColor} opacity="0.18" />
              </g>
            </svg>

            {showSecondHex && (
              <svg viewBox="0 0 280 160" className={showBibSquare ? "w-1/3" : "w-[96%]"} style={{ transform: showBibSquare ? "translateY(0)" : "translateY(-0.5cm)" }}>
                <g transform="translate(140, 80)">
                  <polygon
                    points="0,-58 50.2,-29 50.2,29 0,58 -50.2,29 -50.2,-29"
                    fill={hexFill}
                    stroke={hexStroke}
                    strokeWidth="1"
                  />
                  <ellipse cx="-12" cy="-26" rx="16" ry="7" fill={glossColor} opacity="0.18" />
                  {showMedal && (
                    <text
                      x="0"
                      y="6"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      fontSize="18"
                      fontWeight="700"
                      letterSpacing="0.15em"
                      fontFamily="system-ui, sans-serif"
                    >
                      MEDAL
                    </text>
                  )}
                </g>
              </svg>
            )}

            {showBibSquare && (
              <svg viewBox="0 0 140 180" className="w-1/3">
                <rect
                  x="10"
                  y="10"
                  width="120"
                  height="160"
                  rx="4"
                  fill="#111111"
                  stroke={hexStroke}
                  strokeWidth="1"
                />
                <text
                  x="70"
                  y="55"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="600"
                  letterSpacing="0.1em"
                  fontFamily="system-ui, sans-serif"
                >
                  BIB
                </text>
                <text
                  x="70"
                  y="100"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  fontSize="32"
                  fontWeight="700"
                  letterSpacing="0.05em"
                  fontFamily="system-ui, sans-serif"
                >
                  2847
                </text>
              </svg>
            )}
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
                  <span className="text-[6px] tracking-[0.14em] opacity-75" style={{ color: "#111111" }}>{label}</span>
                  <span className="max-w-full truncate text-[8px] font-semibold tracking-[0.04em]" style={{ color: "#111111" }}>
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
