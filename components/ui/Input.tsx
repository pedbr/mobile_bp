/**
 * Reusable text input component built on React Native Paper.
 * Wraps TextInput with optional error message display via HelperText.
 */
import type React from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

export interface InputProps
  extends React.ComponentProps<typeof TextInput> {
  /** Error message displayed below the input when present */
  errorMessage?: string;
}

/**
 * A text input component wrapping React Native Paper's TextInput.
 * Displays HelperText below the input when errorMessage is provided.
 * Default mode is "outlined".
 */
export function Input({
  errorMessage,
  mode = 'outlined',
  error = Boolean(errorMessage),
  ...rest
}: InputProps): React.ReactElement {
  return (
    <View>
      <TextInput
        mode={mode}
        error={error}
        {...rest}
      />
      {errorMessage ? (
        <HelperText type="error" visible>
          {errorMessage}
        </HelperText>
      ) : null}
    </View>
  );
}
