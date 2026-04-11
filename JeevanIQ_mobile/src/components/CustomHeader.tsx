import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../utils/colors';
import Fonts from '../utils/fonts';
import D from '../utils/dimensions';

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleAccent?: string; // highlighted portion of title
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightElement,
  style,
  titleAccent,
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Left section */}
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
            {titleAccent ? (
              <Text style={styles.titleAccent}>{titleAccent}</Text>
            ) : null}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Right section */}
      {rightElement ? (
        <View style={styles.right}>{rightElement}</View>
      ) : null}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    paddingTop: D.STATUSBAR_HEIGHT + D.spacing.sm,
    paddingBottom: D.spacing.base,
    paddingHorizontal: D.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: D.spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: D.radius.sm,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  backArrow: {
    color: Colors.primary,
    fontSize: 18,
    fontFamily: Fonts.Bold,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xl,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  titleAccent: {
    color: Colors.primary,
  },
  subtitle: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: D.spacing.sm,
    marginLeft: D.spacing.sm,
  },
});