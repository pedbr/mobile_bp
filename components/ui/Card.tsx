/**
 * Reusable card component built on React Native Paper.
 * Thin wrapper with sensible defaults for elevation and border radius.
 */
import type React from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

export type CardProps = React.ComponentProps<typeof PaperCard>;

/**
 * A card component wrapping React Native Paper's Card.
 * Uses elevation 2 and 12px border radius by default.
 * Exposes Card.Content, Card.Actions, Card.Cover, Card.Title for composition.
 */
function CardComponent(props: CardProps): React.ReactElement {
  const { style, contentStyle, elevation, mode, ...rest } = props;
  const resolvedElevation =
    mode === 'outlined' ? undefined : (elevation ?? 2);
  return (
    // @ts-expect-error Paper Card uses a discriminated union (mode + elevation); we resolve at runtime
    <PaperCard
      mode={mode}
      {...rest}
      {...(resolvedElevation !== undefined && { elevation: resolvedElevation })}
      style={[styles.card, style]}
      contentStyle={[styles.content, contentStyle]}
    />
  );
}

export const Card = Object.assign(CardComponent, {
  Content: PaperCard.Content,
  Actions: PaperCard.Actions,
  Cover: PaperCard.Cover,
  Title: PaperCard.Title,
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
  content: {
    borderRadius: 12,
  },
});
