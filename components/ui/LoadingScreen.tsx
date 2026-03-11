/**
 * Full-screen loading indicator component.
 * Centers an ActivityIndicator on the screen with optional message.
 */
import type React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

export interface LoadingScreenProps {
  /** Optional message displayed below the spinner */
  message?: string;
}

/**
 * Displays a full-screen loading state with centered spinner.
 * Uses NativeWind for flexible layout.
 */
export function LoadingScreen({
  message,
}: LoadingScreenProps): React.ReactElement {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
      {message ? (
        <Text variant="bodyMedium" style={styles.message}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    marginTop: 16,
  },
});
