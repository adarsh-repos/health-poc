import { ICONS, type IconName } from './icons.generated';

/** Ionicons, the same set as the app. Decorative: always pair with a visible word. */
export function Icon({ name, size, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 512 512"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}

export type { IconName };
