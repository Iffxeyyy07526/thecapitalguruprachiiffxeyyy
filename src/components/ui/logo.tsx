import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils/cn";

export type LogoVariant =
  | "main"
  | "icon"
  | "light"
  | "inverted"
  | "mono"
  | "symbol";

export type LogoProps = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  variant?: LogoVariant;
  /** Wordmark layout; `stacked` uses the same transparent horizontal wordmark (no square mark). */
  composition?: "horizontal" | "stacked";
  alt?: string;
};

/** Full horizontal wordmark (transparent PNG). */
const MAIN = { src: "/logo-main.png" as const, width: 846, height: 235 };
/** Square mark for compact icon/symbol slots (JPEG). */
const ICON = { src: "/logo-icon.jpg" as const, width: 1024, height: 1024 };

function resolveAsset(
  variant: LogoVariant,
  composition: "horizontal" | "stacked"
): { src: string; width: number; height: number } {
  if (variant === "symbol" || variant === "icon") {
    return { ...ICON };
  }
  if (variant === "light" || variant === "inverted" || variant === "mono") {
    return { ...MAIN };
  }
  if (composition === "stacked") {
    return { ...MAIN };
  }
  return { ...MAIN };
}

/**
 * Brand logos from `/public`. Default export only:
 * `import Logo from "@/components/ui/logo"`
 */
export default function Logo({
  variant = "main",
  composition = "horizontal",
  alt = "The Capital Guru",
  className,
  ...props
}: LogoProps) {
  const { src, width, height } = resolveAsset(variant, composition);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        "object-contain drop-shadow-[0_0_10px_rgba(34,197,94,0.35)]",
        className
      )}
      {...props}
    />
  );
}
