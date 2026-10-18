import { BRAND } from "@/config/brand";

/** Circular brand badge (mascot face), served as WebP with a PNG fallback. */
export default function BrandLogo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-primary/60 shadow-[0_0_18px_hsl(43_74%_55%/0.35)] ${className}`}
      style={{ width: size, height: size }}
    >
      <picture>
        <source type="image/webp" srcSet="/brand/logo-64.webp 64w, /brand/logo-128.webp 128w" sizes={`${size}px`} />
        <img
          src="/brand/logo-64.png"
          srcSet="/brand/logo-64.png 64w, /brand/logo-128.png 128w"
          sizes={`${size}px`}
          width={size}
          height={size}
          alt={BRAND.logoAlt}
          className="h-full w-full object-cover"
          decoding="async"
        />
      </picture>
    </span>
  );
}
