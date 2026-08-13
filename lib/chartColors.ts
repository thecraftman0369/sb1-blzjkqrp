// Dark-mode categorical slots from the validated reference palette
// (dataviz skill, references/palette.md) — fixed order, never cycled per
// series identity. Assigned by stable index, not re-sorted by value.
export const CATEGORICAL_DARK = [
  '#3987e5', // blue
  '#d95926', // orange
  '#199e70', // aqua
  '#c98500', // yellow
  '#d55181', // magenta
  '#008300', // green
  '#9085e9', // violet
  '#e66767', // red
] as const;

export const STATUS_DARK = {
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
} as const;

export const SEQUENTIAL_BLUE_DARK = '#3987e5';

export const CHART_CHROME_DARK = {
  gridline: '#2c2c2a',
  axis: '#383835',
  mutedText: '#898781',
  primaryText: '#ffffff',
} as const;

export function categoricalColor(index: number): string {
  return CATEGORICAL_DARK[index % CATEGORICAL_DARK.length];
}
