/**
 * Typography scale constants for the app.
 * Defines font family names and a complete typography scale with
 * fontSize, lineHeight, and fontFamily for each text style.
 */

/** Font family names for Inter font weights */
export const FONT_FAMILY = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
} as const;

export type TypographyScaleKey =
  | 'caption'
  | 'body'
  | 'bodyLarge'
  | 'subtitle'
  | 'title'
  | 'headline'
  | 'display';

export interface TypographyScaleEntry {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
}

/**
 * Typography scale mapping size names to font properties.
 * Uses Material Design 3-inspired line height ratios (~1.2–1.25x fontSize).
 */
export const TYPOGRAPHY_SCALE: Record<TypographyScaleKey, TypographyScaleEntry> = {
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.regular,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONT_FAMILY.regular,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONT_FAMILY.regular,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FONT_FAMILY.medium,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: FONT_FAMILY.medium,
  },
  headline: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: FONT_FAMILY.bold,
  },
  display: {
    fontSize: 34,
    lineHeight: 42,
    fontFamily: FONT_FAMILY.bold,
  },
} as const;
