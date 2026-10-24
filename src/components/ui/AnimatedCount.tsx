import { useEffect, useRef, useState } from 'react';

import { AppText, type AppTextProps } from './AppText';

/** Counts up from the previous value to `value` (Offscreen handoff: stats animate 0 → value). */
export function AnimatedCount({
  value,
  duration = 700,
  ...text
}: AppTextProps & { value: number; duration?: number }) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const start = Date.now();
    const begin = from.current;
    let frame: number;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(begin + (value - begin) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <AppText {...text} accessibilityLabel={String(value)}>
      {shown}
    </AppText>
  );
}
