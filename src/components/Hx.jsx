'use client';
import { useState } from 'react';
import { cx } from '@/lib/style';

// Faithful port of the x-dc `style="…" style-hover="…" style-focus="…"` pattern.
// `s` = base styles, `sh` = hover overlay, `sf` = focus overlay (all CSS strings).
export function Hx({ as: Tag = 'div', s, sh, sf, style, ...rest }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const merged = {
    ...cx(s),
    ...(hovered && sh ? cx(sh) : null),
    ...(focused && sf ? cx(sf) : null),
    ...style,
  };
  return (
    <Tag
      style={merged}
      onMouseEnter={sh ? () => setHovered(true) : rest.onMouseEnter}
      onMouseLeave={sh ? () => setHovered(false) : rest.onMouseLeave}
      onFocus={sf ? () => setFocused(true) : rest.onFocus}
      onBlur={sf ? () => setFocused(false) : rest.onBlur}
      {...rest}
    />
  );
}
