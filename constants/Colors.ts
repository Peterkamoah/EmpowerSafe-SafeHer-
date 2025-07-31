/**
 * SafeHer Brand Colors
 * Primary: #F472B6 (Warm Pink)
 * Text/Primary: #1F2937 (Dark Gray)
 * Text/Secondary: #6B7280 (Medium Gray)
 * Background/Primary: #FFFFFF (White)
 * Background/Secondary: #F9FAFB (Light Gray)
 */

const primaryPink = '#F472B6';
const darkGray = '#1F2937';
const mediumGray = '#6B7280';
const white = '#FFFFFF';
const lightGray = '#F9FAFB';

export const Colors = {
  light: {
    text: darkGray,
    textSecondary: mediumGray,
    background: white,
    backgroundSecondary: lightGray,
    tint: primaryPink,
    primary: primaryPink,
    icon: mediumGray,
    tabIconDefault: mediumGray,
    tabIconSelected: primaryPink,
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    backgroundSecondary: '#1F2937',
    tint: primaryPink,
    primary: primaryPink,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryPink,
  },
};

// SafeHer specific color exports for direct use
export const SafeHerColors = {
  primary: primaryPink,
  textPrimary: darkGray,
  textSecondary: mediumGray,
  backgroundPrimary: white,
  backgroundSecondary: lightGray,
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};
