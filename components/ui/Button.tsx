/**
 * Reusable button component built on React Native Paper.
 * Provides a styled button with optional full-width layout and sensible defaults.
 */
import type React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

export interface ButtonProps
  extends React.ComponentProps<typeof PaperButton> {
  /** When true, stretches the button to full width of its container */
  fullWidth?: boolean;
}

/**
 * A button component wrapping React Native Paper's Button.
 * Default mode is "contained" for primary actions.
 */
export function Button({
  fullWidth = false,
  mode = 'contained',
  style,
  ...rest
}: ButtonProps): React.ReactElement {
  return (
    <PaperButton
      mode={mode}
      style={[fullWidth && styles.fullWidth, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
});
