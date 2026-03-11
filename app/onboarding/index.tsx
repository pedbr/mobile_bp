/**
 * Swipeable onboarding flow with 3 slides.
 * Uses a FlatList for horizontal paging with dot indicators.
 * Marks onboarding complete in the app store on the final slide CTA.
 */

import { useRef, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  type ViewToken,
  type ListRenderItemInfo,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui";
import { OnboardingSlide } from "@/components/onboarding/OnboardingSlide";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Slide {
  id: string;
  title: string;
  description: string;
  image: number;
}

const SLIDES: Slide[] = [
  {
    id: "1",
    title: "Welcome to MyApp",
    description:
      "Your all-in-one solution for staying organized and productive. Track your tasks, manage your time, and achieve your goals.",
    image: require("@/assets/images/onboarding-1.png"),
  },
  {
    id: "2",
    title: "Stay Connected",
    description:
      "Sync across all your devices seamlessly. Your data is always backed up and accessible wherever you go.",
    image: require("@/assets/images/onboarding-2.png"),
  },
  {
    id: "3",
    title: "Unlock Premium",
    description:
      "Get access to advanced features, unlimited storage, and priority support with a premium subscription.",
    image: require("@/assets/images/onboarding-3.png"),
  },
];

export default function OnboardingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const setHasSeenOnboarding = useAppStore((s) => s.setHasSeenOnboarding);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === SLIDES.length - 1;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const handleNext = () => {
    if (isLastSlide) {
      handleGetStarted();
    } else {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    }
  };

  const handleGetStarted = () => {
    setHasSeenOnboarding(true);
    router.replace("/(auth)/login");
  };

  const handleSkip = () => {
    setHasSeenOnboarding(true);
    router.replace("/(auth)/login");
  };

  const renderSlide = ({ item }: ListRenderItemInfo<Slide>) => (
    <View style={{ width: SCREEN_WIDTH }}>
      <OnboardingSlide
        title={item.title}
        description={item.description}
        image={item.image}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <View className="flex-1">
        {/* Skip button */}
        <View className="flex-row justify-end px-4 pt-2">
          {!isLastSlide && (
            <Button mode="text" onPress={handleSkip} compact>
              Skip
            </Button>
          )}
        </View>

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />

        {/* Pagination dots */}
        <View className="flex-row justify-center items-center py-4 gap-2">
          {SLIDES.map((slide, index) => (
            <View
              key={slide.id}
              style={{
                width: index === activeIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  index === activeIndex
                    ? theme.colors.primary
                    : theme.colors.outlineVariant,
              }}
            />
          ))}
        </View>

        {/* Action button */}
        <View className="px-6 pb-8">
          <Button onPress={handleNext} fullWidth>
            {isLastSlide ? "Get Started" : "Next"}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
