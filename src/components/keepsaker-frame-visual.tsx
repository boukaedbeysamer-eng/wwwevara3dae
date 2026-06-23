import keepsakerFrame from "@/assets/keepsaker-frame.png.asset.json";

type Props = {
  alt?: string;
  className?: string;
};

export function KeepsakerFrameVisual({ alt = "Keepsaker 3D-printed topographic frame", className = "" }: Props) {
  return (
    <img
      src={keepsakerFrame.url}
      alt={alt}
      className={`aspect-square w-full object-cover ${className}`}
    />
  );
}
