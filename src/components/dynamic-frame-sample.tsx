import type { FrameFinish, MapColor, TrackColor } from "@/data/products";

export type FrameDetails = {
  raceName?: string;
  customerName?: string;
  date?: string;
  distance?: string;
  time?: string;
  duration?: string;
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
  duration = "DURATION",
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
          {/* topographic background */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 300 420"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            <defs>
              <pattern id="topo" x="0" y="0" width="300" height="420" patternUnits="userSpaceOnUse">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ellipse
                    key={i}
                    cx={150 + (i % 2 === 0 ? -10 : 12)}
                    cy={210 + (i % 3) * 4}
                    rx={40 + i * 14}
                    ry={28 + i * 10}
                    fill="none"
                    stroke="#d8d2c4"
                    strokeWidth="0.6"
                  />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                  <ellipse
                    key={`b${i}`}
                    cx={60 + i * 8}
                    cy={80 + i * 6}
                    rx={30 + i * 10}
                    ry={22 + i * 8}
                    fill="none"
                    stroke="#e2ddd1"
                    strokeWidth="0.5"
                  />
                ))}
              </pattern>
            </defs>
            <rect width="300" height="420" fill="url(#topo)" />
          </svg>

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

          {/* Hexagon with route */}
          <div className="relative z-10 flex flex-1 items-center justify-center px-6">
            <svg viewBox="0 0 200 180" className="w-[72%]">
              <polygon
                points="100,8 188,54 188,146 100,192 12,146 12,54"
                fill={relief}
                stroke={mapColor === "White" ? "#ddd" : "none"}
                strokeWidth="1"
              />
              {/* sample route line */}
              <path
                d="M55,130 C70,90 95,80 110,95 C125,110 140,75 155,60"
                fill="none"
                stroke={reliefOutline}
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.9"
              />
              {/* track color overlay route */}
              <path
                d="M50,140 C72,110 88,118 105,98 C120,80 138,92 160,70"
                fill="none"
                stroke={track}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Stats grid */}
          <div className="relative z-10 px-5 pb-5" style={{ color: textColor }}>
            <div className="grid grid-cols-3 gap-y-3 text-center">
              {[
                { label: "DATE", value: date },
                { label: "DISTANCE", value: distance },
                { label: "TIME", value: time },
                { label: "DURATION", value: duration },
                { label: "LOCATION", value: location },
                { label: "ELEVATION", value: elevation },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div
                    className="h-2 w-2 rounded-sm"
                    style={{ backgroundColor: textColor, opacity: 0.85 }}
                  />
                  <span className="text-[7px] tracking-[0.14em]">{label}</span>
                  <span className="max-w-full truncate text-[9px] font-medium tracking-[0.04em]">
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
