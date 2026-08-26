import keepsakerFrame from "@/assets/keepsaker-frame.png.asset.json";
import { ResponsiveImage } from "@/components/responsive-image";

type Props = {
  alt?: string;
  className?: string;
};

export function KeepsakerFrameVisual({ alt = "Keepsaker 3D-printed topographic frame", className = "" }: Props) {
  return (
    <ResponsiveImage
      src={keepsakerFrame.url}
      alt={alt}
      sizes="(min-width: 768px) 50vw, 100vw"
      className={`aspect-square w-full object-cover ${className}`}
    />
  );
}
