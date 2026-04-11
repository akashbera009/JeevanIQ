import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
// import { logoutAction } from '../../auth/authActions';
import Colors from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import D from '../../../utils/dimensions';
import { getInitials } from '../../../utils/commonFunctions';
import CustomHeader from '../../../components/CustomHeader';

const MenuItem: React.FC<{
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
  value?: string;
  delay?: number;
}> = ({ icon, label, onPress, danger, value, delay = 0 }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(350)}>
    <TouchableOpacity onPress={onPress} style={styles.menuItem} activeOpacity={0.75}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Text style={styles.menuIconText}>{icon}</Text>
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      {value ? <Text style={styles.menuValue}>{value}</Text> : null}
      {!danger && <Text style={styles.menuArrow}>›</Text>}
    </TouchableOpacity>
  </Animated.View>
);

const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.auth);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        // onPress: () => dispatch(logoutAction()),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Profile" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Profile Hero */}
        <Animated.View entering={FadeInDown.delay(50).duration(450)} style={styles.profileHero}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name ? getInitials(user.name) : '?'}
              </Text>
            </View>
            <View style={styles.onlineDot} />
          </View>

          <Text style={styles.userName}>{user?.name ?? 'Unknown User'}</Text>
          <Text style={styles.userRole}>{user?.role?.toUpperCase() ?? 'STAFF'}</Text>
          {user?.department && (
            <Text style={styles.userDept}>{user.department}</Text>
          )}

          <View style={styles.userContact}>
            {user?.phone && (
              <View style={styles.contactChip}>
                <Text style={styles.contactIcon}>📱</Text>
                <Text style={styles.contactText}>{user.phone}</Text>
              </View>
            )}
            {user?.email && (
              <View style={styles.contactChip}>
                <Text style={styles.contactIcon}>✉</Text>
                <Text style={styles.contactText}>{user.email}</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Account Section */}
        <Animated.View entering={FadeInDown.delay(150).duration(350)} style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionCard}>
            <MenuItem icon="👤" label="Edit Profile" onPress={() => {}} delay={200} />
            <View style={styles.menuDivider} />
            <MenuItem icon="🔒" label="Change Password" onPress={() => {}} delay={240} />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="🔑"
              label="Role"
              value={user?.role ?? '—'}
              onPress={() => {}}
              delay={280}
            />
          </View>
        </Animated.View>

        {/* Preferences Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(350)} style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionCard}>
            <MenuItem icon="🔔" label="Notifications" onPress={() => {}} delay={350} />
            <View style={styles.menuDivider} />
            <MenuItem icon="🌙" label="Theme" value="Dark" onPress={() => {}} delay={390} />
            <View style={styles.menuDivider} />
            <MenuItem icon="📍" label="Location" onPress={() => {}} delay={430} />
          </View>
        </Animated.View>

        {/* About Section */}
        <Animated.View entering={FadeInDown.delay(450).duration(350)} style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionCard}>
            <MenuItem icon="ℹ" label="About JeevanIQ" onPress={() => {}} delay={500} />
            <View style={styles.menuDivider} />
            <MenuItem icon="📄" label="Terms & Privacy" onPress={() => {}} delay={540} />
            <View style={styles.menuDivider} />
            <MenuItem icon="⭐" label="Rate App" onPress={() => {}} delay={580} />
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(600).duration(350)} style={styles.section}>
          <View style={styles.sectionCard}>
            <MenuItem
              icon="🚪"
              label="Logout"
              onPress={handleLogout}
              danger
              delay={640}
            />
          </View>
        </Animated.View>

        {/* Version */}
        <Animated.View entering={FadeInDown.delay(680).duration(350)} style={styles.versionRow}>
          <Text style={styles.versionText}>JeevanIQ v1.0.0</Text>
          <View style={styles.versionDot} />
          <Text style={styles.versionText}>Built with ♥ for better healthcare</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: D.spacing.xxxl,
  },
  profileHero: {
    alignItems: 'center',
    paddingVertical: D.verticalScale(24),
    paddingHorizontal: D.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: D.spacing.base,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: D.spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xl,
    color: Colors.primary,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  userName: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xxl,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  userRole: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xs,
    color: Colors.primary,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  userDept: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.sm,
    color: Colors.textMuted,
    marginBottom: D.spacing.md,
  },
  userContact: {
    gap: D.spacing.sm,
    alignItems: 'center',
  },
  contactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.backgroundCard,
    borderRadius: D.radius.full,
    paddingHorizontal: D.spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactIcon: {
    fontSize: 12,
  },
  contactText: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.sm,
    color: Colors.textSecondary,
  },
  section: {
    marginHorizontal: D.spacing.base,
    marginBottom: D.spacing.md,
  },
  sectionTitle: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.sm,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: D.spacing.sm,
    marginLeft: D.spacing.xs,
  },
  sectionCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: D.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: D.spacing.md,
    paddingHorizontal: D.spacing.base,
    gap: D.spacing.md,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: D.radius.sm,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDanger: {
    backgroundColor: Colors.errorMuted,
  },
  menuIconText: {
    fontSize: 15,
  },
  menuLabel: {
    flex: 1,
    fontFamily: Fonts.Medium,
    fontSize: D.fontSize.base,
    color: Colors.textPrimary,
  },
  menuLabelDanger: {
    color: Colors.error,
  },
  menuValue: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.sm,
    color: Colors.textMuted,
  },
  menuArrow: {
    fontSize: 18,
    color: Colors.textMuted,
    fontFamily: Fonts.Light,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: 56 + D.spacing.base,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: D.spacing.sm,
    paddingTop: D.spacing.base,
    marginBottom: D.spacing.base,
  },
  versionDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  versionText: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
  },
});

export default ProfileScreen;