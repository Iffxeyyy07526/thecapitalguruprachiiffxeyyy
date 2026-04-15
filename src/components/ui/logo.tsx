import Image, { type ImageProps } from "next/image";

export type LogoVariant =
  | "main"
  | "icon"
  | "light"
  | "inverted"
  | "mono"
  | "symbol";

export type LogoProps = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  variant?: LogoVariant;
  /** Wordmark layout; only applies when `variant` is `main`. */
  composition?: "horizontal" | "stacked";
  alt?: string;
};

/** Full horizontal wordmark (transparent PNG). */
const MAIN = { src: "/logo-main.png" as const, width: 846, height: 235 };
/** Square symbol — transparent (UI icon, watermark-style). */
const ICON = { src: "/logo-icon.png" as const, width: 1024, height: 1024 };
function resolveAsset(
  variant: LogoVariant,
  composition: "horizontal" | "stacked"
): { src: string; width: number; height: number } {
  if (variant === "symbol" || variant === "icon") {
    return { ...ICON };
  }
  if (variant === "light") {
    return { ...MAIN };
  }
  if (variant === "inverted" || variant === "mono") {
    return { ...MAIN };
  }
  if (composition === "stacked") {
    return { ...ICON };
  }
  return { ...MAIN };
}

/**
 * Brand logos from `/public` (PNG). Default export only:
 * `import Logo from "@/components/ui/logo"`
 */
export default function Logo({
  variant = "main",
  composition = "horizontal",
  alt = "The Capital Guru",
  ...props
}: LogoProps) {
  const { src, width, height } = resolveAsset(variant, composition);
  return <Image src={src} alt={alt} width={width} height={height} {...props} />;
}
