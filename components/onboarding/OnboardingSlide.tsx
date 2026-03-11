/**
 * Individual onboarding slide component.
 * Displays a single slide with image, title, and description.
 */
import { Image } from 'expo-image';
import type React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export interface OnboardingSlideProps {
  /** Slide title */
  title: string;
  /** Slide description text */
  description: string;
  /** Image source: require() result or URI object */
  image: number | string | { uri: string };
}

/**
 * Renders a single onboarding slide with centered layout.
 * Image on top, title and description below. Uses NativeWind for layout.
 */
export function OnboardingSlide({
  title,
  description,
  image,
}: OnboardingSlideProps): React.ReactElement {
  const imageSource =
    typeof image === "number"
      ? image
      : typeof image === "string"
        ? { uri: image }
        : image;

  return (
    <View className="flex-1 items-center justify-center px-6">
      <Image
        source={imageSource}
        style={styles.image}
        contentFit="contain"
      />
      <Text variant="headlineMedium" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodyLarge" style={styles.description}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
  },
});
