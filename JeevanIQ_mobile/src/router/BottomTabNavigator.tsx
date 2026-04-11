import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabParamList } from '../utils/types';
import { ScreenNames } from '../utils/screenNames';
import Colors from '../utils/colors';
import Fonts from '../utils/fonts';
import D from '../utils/dimensions';
import HomeNavigator from './HomeNavigator';
import QueueNavigator from './QueueNavigator';
import PatientNavigator from './PatientNavigator';
import DoctorNavigator from './DoctorNavigator';
import ProfileNavigator from './ProfileNavigator';

// ─── Tab config ───────────────────────────────────────────────────────────────
const TAB_ICONS: Record<string, string> = {
  [ScreenNames.HOME_TAB]: '⌂',
  [ScreenNames.QUEUE_TAB]: '≡',
  [ScreenNames.PATIENTS_TAB]: '♥',
  [ScreenNames.DOCTORS_TAB]: '+',
  [ScreenNames.PROFILE_TAB]: '◉',
};

const TAB_LABELS: Record<string, string> = {
  [ScreenNames.HOME_TAB]: 'Home',
  [ScreenNames.QUEUE_TAB]: 'Queue',
  [ScreenNames.PATIENTS_TAB]: 'Patients',
  [ScreenNames.DOCTORS_TAB]: 'Doctors',
  [ScreenNames.PROFILE_TAB]: 'Profile',
};

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom + 8 }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const scale = useSharedValue(1);

        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: scale.value }],
        }));

        const handlePress = () => {
          scale.value = withSpring(0.88, { damping: 10 }, () => {
            scale.value = withSpring(1, { damping: 10 });
          });

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={handlePress}
            style={styles.tabItem}
            activeOpacity={1}>
            <Animated.View style={[styles.tabContent, animatedStyle]}>
              {isFocused && <View style={styles.activeBackground} />}
              <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
                {TAB_ICONS[route.name]}
              </Text>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {TAB_LABELS[route.name]}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── Navigator ────────────────────────────────────────────────────────────────
const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator: React.FC = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}>
    <Tab.Screen name={ScreenNames.HOME_TAB} component={HomeNavigator} />
    <Tab.Screen name={ScreenNames.QUEUE_TAB} component={QueueNavigator} />
    <Tab.Screen name={ScreenNames.PATIENTS_TAB} component={PatientNavigator} />
    <Tab.Screen name={ScreenNames.DOCTORS_TAB} component={DoctorNavigator} />
    <Tab.Screen name={ScreenNames.PROFILE_TAB} component={ProfileNavigator} />
  </Tab.Navigator>
);

export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBarBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: D.spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: D.spacing.sm,
    borderRadius: D.radius.md,
    minWidth: 52,
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    inset: 0,
    backgroundColor: Colors.primaryMuted,
    borderRadius: D.radius.md,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  tabIcon: {
    fontSize: 18,
    color: Colors.tabBarInactive,
    marginBottom: 2,
  },
  tabIconActive: {
    color: Colors.tabBarActive,
  },
  tabLabel: {
    fontFamily: Fonts.Medium,
    fontSize: D.fontSize.xs,
    color: Colors.tabBarInactive,
  },
  tabLabelActive: {
    color: Colors.tabBarActive,
    fontFamily: Fonts.Bold,
  },
});