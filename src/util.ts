import { ColorData } from 'articy-node';
import { CSSProperties } from 'react';

/**
 * Converts articy colour data into a CSS rgb string suitable for styling
 * @param color Articy colour
 */
export function toCSSColor(color?: ColorData): string | undefined {
  if (!color) {
    return undefined;
  }
  return `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
}

/**
 * Creates a CSSProperties with a '--color' setting set to the value of the articy colour
 * @param color Articy colour
 */
export function toCSSProperties(color?: ColorData): CSSProperties {
  if (!color) {
    return {};
  }

  return { '--color': toCSSColor(color) } as CSSProperties;
}
