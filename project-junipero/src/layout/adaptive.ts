import { useWindowDimensions } from "react-native";

/**
 * Adaptive layout from available window space — Apple iPhone Duo prepare guide:
 * never use orientation APIs, UIScreen.main, or device idiom for layout.
 * Re-read size every render via useWindowDimensions (updates on fold / Split View).
 * @see https://developer.apple.com/iphone-duo/prepare/
 * @see https://expo.dev/blog/supporting-iphone-duo
 */
export function useAdaptiveLayout() {
  const { width, height, scale, fontScale } = useWindowDimensions();

  // Approx. regular horizontal size class (inner Duo / large Split View / iPad).
  const isRegularWidth = width >= 600;
  const isWide = width >= 900;
  // Shape from bounds, not UIDevice orientation.
  const isLandscapeShape = width > height;

  return {
    width,
    height,
    scale,
    fontScale,
    isRegularWidth,
    isWide,
    isLandscapeShape,
    /** Readable content column on regular-width canvases. */
    contentMaxWidth: isRegularWidth ? Math.min(720, width - 48) : undefined,
  };
}
