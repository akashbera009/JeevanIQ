import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { fetchDoctorsAction } from '../doctorSlice';
import { Doctor, DoctorStackParamList } from '../../../utils/types';
import { ScreenNames } from '../../../utils/screenNames';
import Colors from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import D from '../../../utils/dimensions';
import Strings from '../../../utils/strings';
import { getInitials } from '../../../utils/commonFunctions';
import CustomHeader from '../../../components/CustomHeader';

const DEPT_COLORS = [
  Colors.primary,
  Colors.info,
  Colors.success,
  Colors.warning,
  Colors.critical,
];

const DoctorCard: React.FC<{
  doctor: Doctor;
  index: number;
  onPress: () => void;
}> = ({ doctor, index, onPress }) => {
  const accentColor = DEPT_COLORS[index % DEPT_COLORS.length];

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(350)}>
      <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
        {/* Left color strip */}
        <View style={[styles.cardStrip, { backgroundColor: accentColor }]} />

        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: accentColor + '22', borderColor: accentColor }]}>
          <Text style={[styles.avatarText, { color: accentColor }]}>
            {getInitials(doctor.name)}
          </Text>
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
          <Text style={styles.specialization}>{doctor.specialization}</Text>
          <View style={styles.deptRow}>
            <Text style={styles.deptIcon}>🏥</Text>
            <Text style={styles.deptText}>{doctor.department.name}</Text>
          </View>
        </View>

        {/* Right stats */}
        <View style={styles.cardRight}>
          <View style={[
            styles.availBadge,
            { backgroundColor: doctor.isAvailable ? Colors.successMuted : Colors.errorMuted,
              borderColor: doctor.isAvailable ? Colors.success : Colors.error },
          ]}>
            <View style={[
              styles.availDot,
              { backgroundColor: doctor.isAvailable ? Colors.success : Colors.error },
            ]} />
            <Text style={[
              styles.availText,
              { color: doctor.isAvailable ? Colors.success : Colors.error },
            ]}>
              {doctor.isAvailable ? 'Available' : 'Busy'}
            </Text>
          </View>

          <Text style={styles.patientCount}>
            {doctor.currentPatientCount} patients
          </Text>
          <Text style={styles.consultTime}>
            ~{doctor.avgConsultTime}m avg
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const DoctorListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<DoctorStackParamList>>();
  const { list, isLoading } = useAppSelector(s => s.doctors);

  const loadDoctors = useCallback(() => {
    dispatch(fetchDoctorsAction());
  }, [dispatch]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const availableCount = list.filter(d => d.isAvailable).length;

  return (
    <View style={styles.container}>
      <CustomHeader
        title={Strings.doctors}
        subtitle={`${availableCount} of ${list.length} available`}
      />

      <FlatList
        data={list}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadDoctors}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListHeaderComponent={
          <Animated.View entering={FadeInDown.delay(50).duration(350)} style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.success }]}>{availableCount}</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.error }]}>
                {list.length - availableCount}
              </Text>
              <Text style={styles.statLabel}>Busy</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.primary }]}>{list.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </Animated.View>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>👨‍⚕️</Text>
              <Text style={styles.emptyTitle}>{Strings.noDoctors}</Text>
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <DoctorCard
            doctor={item}
            index={index}
            onPress={() =>
              navigation.navigate(ScreenNames.DOCTOR_DETAIL, { doctorId: item.id })
            }
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderRadius: D.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: D.spacing.md,
    marginBottom: D.spacing.base,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xl,
  },
  statLabel: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  listContent: {
    paddingHorizontal: D.spacing.base,
    paddingTop: D.spacing.base,
    paddingBottom: D.spacing.xxxl,
    gap: D.spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: D.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    paddingRight: D.spacing.md,
    paddingVertical: D.spacing.md,
    gap: D.spacing.sm,
  },
  cardStrip: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginLeft: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.base,
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  doctorName: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.base,
    color: Colors.textPrimary,
  },
  specialization: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.sm,
    color: Colors.textSecondary,
  },
  deptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  deptIcon: {
    fontSize: 10,
  },
  deptText: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  availBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: D.spacing.sm,
    paddingVertical: 3,
    borderRadius: D.radius.full,
    borderWidth: 1,
  },
  availDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  availText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xs,
  },
  patientCount: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
  },
  consultTime: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: D.verticalScale(80),
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: D.spacing.base,
  },
  emptyTitle: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.lg,
    color: Colors.textSecondary,
  },
});

export default DoctorListScreen;