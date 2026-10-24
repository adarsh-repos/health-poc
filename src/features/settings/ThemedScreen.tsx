import { Fragment, type ReactElement, type ReactNode } from 'react';

import { useThemeKey } from './appearance';

/** Routes that are navigators themselves; remounting them would reset their history. */
const NAVIGATORS = new Set(['(tabs)', '(onboarding)', 'add', 'abha', 'member/add']);

function ThemedScreen({ keyed, children }: { keyed: boolean; children: ReactNode }) {
  const key = useThemeKey();
  return keyed ? <Fragment key={key}>{children}</Fragment> : <>{children}</>;
}

/**
 * Pass as `screenLayout` to every navigator: on a theme change each visible
 * screen repaints in place, without losing where the user is.
 */
export function themedScreenLayout({
  route,
  children,
}: {
  route: { name: string };
  children: ReactNode;
}): ReactElement {
  return <ThemedScreen keyed={!NAVIGATORS.has(route.name)}>{children}</ThemedScreen>;
}
