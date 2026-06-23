import type { FrameFinish, MapColor, TrackColor } from "@/data/products";

type Props = {
  size?: "sm" | "md" | "lg";
  frameFinish?: FrameFinish;
  mapColor?: MapColor;
  trackColor?: TrackColor;
  className?: string;
};

const frameColor = (f?: FrameFinish) => {
  if (f === "Matte Black") return "#171717";
  if (f === "Wooden") return "#8a5a2b";
  return "#f7f5ef";
};

const reliefColor = (m?: MapColor) => {
  if (m === "White") return "#ffffff";
  if (m === "Green") return "#3C5A3B";
  if (m === "Wooden") return "#8a5a2b";
  return "#181818";
};

const trackHex = (t?: TrackColor) => {
  if (t === "Black") return "#111";
  if (t === "Orange") return "#D9622B";
  return "#c93026";
};

export function AchieverFrameVisual({
  size = "md",
  frameFinish = "Matte Black",
  mapColor = "White",
  trackColor = "Orange",
  className = "",
}: Props) {
  const aspect = size === "lg" ? "aspect-[3/4]" : "aspect-square";
  const fc = frameColor(frameFinish);
  const rc = reliefColor(mapColor);
  const tc = trackHex(trackColor);
  const isLight = frameFinish === "White Matt";

  return (
    <div className={`relative w-full ${aspect} ${className}`}>
      <div
        className="absolute inset-0 rounded-sm shadow-[0_30px_60px_-30px_rgba(14,26,31,0.45)]"
        style={{ backgroundColor: fc, padding: "8%" }}
      >
        <div
          className="relative h-full w-full overflow-hidden"
          style={{ backgroundColor: "#fbfaf6" }}
        >
          <svg
            viewBox="0 0 300 300"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            <g fill="none" stroke="#0E1A1F" strokeWidth="0.6" opacity="0.55">
              {[20, 35, 52, 70, 88, 105, 122].map((r) => (
                <ellipse key={r} cx="150" cy="155" rx={r * 1.25} ry={r} />
              ))}
            </g>
            <path
              d="M55 200 Q90 120 140 140 T215 95 Q245 80 250 130 T200 230 Q160 250 110 220 T55 200 Z"
              fill="none"
              stroke={tc}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g opacity="0.35">
              {[38, 56, 74, 92].map((r, i) => (
                <ellipse
                  key={i}
                  cx={150 + i * 1.2}
                  cy={155 + i * 1.2}
                  rx={r * 1.25}
                  ry={r}
                  fill="none"
                  stroke={rc}
                  strokeWidth="1.4"
                />
              ))}
            </g>
          </svg>

          <div
            className="absolute inset-x-3 bottom-3 flex items-end justify-between text-[8px] tracking-[0.18em]"
            style={{ color: "#0E1A1F" }}
          >
            <div>
              <div className="font-semibold uppercase">Marathon Race</div>
              <div className="opacity-60">Dubai · 21.12.25</div>
            </div>
            <div className="text-right">
              <div className="font-semibold uppercase">42.2 KM</div>
              <div className="opacity-60">+184 M</div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 rounded-sm"
        style={{ boxShadow: isLight ? "inset 0 0 0 1px rgba(0,0,0,0.04)" : "inset 0 0 0 1px rgba(255,255,255,0.06)" }}
      />
    </div>
  );
}
