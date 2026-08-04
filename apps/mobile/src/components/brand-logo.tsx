import { Image, StyleSheet, View, type ImageStyle, type ViewStyle } from "react-native";

import { useEmpire } from "@/contexts/empire";

const ARABIC_LOGO = require("../../assets/images/web-empire-logo-ar-v1.2.png");
const ENGLISH_LOGO = require("../../assets/images/web-empire-logo-en-v1.2.png");
const BRAND_MARK = require("../../assets/images/web-empire-mark-v1.2.png");

type BrandLogoProps = {
  variant?: "horizontal" | "mark";
  width?: number;
  size?: number;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
};

export function BrandLogo({
  variant = "horizontal",
  width = 230,
  size = 72,
  style,
  imageStyle,
}: BrandLogoProps) {
  const { direction } = useEmpire();
  const isArabic = direction === "rtl";

  if (variant === "mark") {
    return (
      <View style={[styles.container, style]}>
        <Image
          source={BRAND_MARK}
          accessibilityLabel={isArabic ? "شعار إمبراطورية الويب" : "Web Empire logo"}
          resizeMode="contain"
          style={[{ width: size, height: size }, imageStyle]}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={isArabic ? ARABIC_LOGO : ENGLISH_LOGO}
        accessibilityLabel={isArabic ? "إمبراطورية الويب" : "Web Empire"}
        resizeMode="contain"
        style={[
          {
            width,
            height: isArabic ? width * 0.34 : width * 0.42,
          },
          imageStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
