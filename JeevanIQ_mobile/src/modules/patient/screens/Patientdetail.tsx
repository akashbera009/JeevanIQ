import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { fetchPatientDetailAction } from '../patientSlice';
import { PatientStackParamList } from '../../../utils/types';
import { ScreenNames } from '../../../utils/screenNames';
import Colors from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import D from '../../../utils/dimensions';
import {
  getSeverityColor,
  getSeverityMutedColor,
  formatWaitTime,
  formatDateTime,
  getInitials,
} from '../../../utils/commonFunctions';
import CustomHeader from '../../../components/CustomHeader';
import CustomButton from '../../../components/CustomButton';

type RouteType = RouteProp<PatientStackParamList, 'PatientDetail'>;

const InfoRow: React.FC<{ label: string; value: string; accent?: boolean }> = ({
  label,
  value,
  accent,
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, accent && styles.infoValueAccent]}>{value}</Text>
  </View>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode; delay?: number }> = ({
  title,
  children,
  delay = 0,
}) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionDivider} />
    </View>
    {children}
  </Animated.View>
);

const PatientDetailScreen: React.FC = () => {
  const route = useRoute<RouteType>();
  const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
  const dispatch = useAppDispatch();
  const { selected: patient, isLoading } = useAppSelector(s => s.patients);

  useEffect(() => {
    dispatch(fetchPatientDetailAction(route.params.patientId));
  }, [route.params.patientId]);

  if (!patient) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Patient" showBack />
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Loading patient data...</Text>
        </View>
      </View>
    );
  }

  const severityColor = getSeverityColor(patient.severity);
  const severityBg = getSeverityMutedColor(patient.severity);

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Patient"
        titleAccent=" Details"
        showBack
        rightElement={
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Hero card */}
        <Animated.View entering={FadeInDown.delay(50).duration(450)} style={styles.heroCard}>
          {/* Top accent */}
          <View style={[styles.heroAccentBar, { backgroundColor: severityColor }]} />

          <View style={styles.heroContent}>
            {/* Avatar */}
            <View style={[styles.heroAvatar, { backgroundColor: severityBg, borderColor: severityColor }]}>
              {patient.isCritical && <View style={styles.criticalPulse} />}
              <Text style={[styles.heroAvatarText, { color: severityColor }]}>
                {getInitials(patient.name)}
              </Text>
            </View>

            {/* Hero info */}
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>{patient.name}</Text>
              <Text style={styles.heroMeta}>
                {patient.age} yrs • {patient.gender} • {patient.bloodGroup ?? 'Unknown'}
              </Text>
              <Text style={styles.heroId}>ID: {patient.patientId}</Text>
            </View>

            {/* Severity badge */}
            <View style={[styles.heroBadge, { backgroundColor: severityBg, borderColor: severityColor }]}>
              {patient.isCritical && <Text style={styles.criticalIcon}>⚠ </Text>}
              <Text style={[styles.heroBadgeText, { color: severityColor }]}>
                {patient.severity.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Queue info strip */}
          {patient.queuePosition != null && (
            <View style={styles.queueStrip}>
              <View style={styles.queueStripItem}>
                <Text style={styles.queueStripValue}>#{patient.queuePosition}</Text>
                <Text style={styles.queueStripLabel}>Position</Text>
              </View>
              <View style={styles.queueStripDivider} />
              <View style={styles.queueStripItem}>
                <Text style={styles.queueStripValue}>
                  {formatWaitTime(patient.estimatedWaitTime)}
                </Text>
                <Text style={styles.queueStripLabel}>Est. Wait</Text>
              </View>
              <View style={styles.queueStripDivider} />
              <View style={styles.queueStripItem}>
                <Text style={styles.queueStripValue}>
                  {formatWaitTime(patient.waitingTime)}
                </Text>
                <Text style={styles.queueStripLabel}>Waited</Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Personal Info */}
        <SectionCard title="Personal Information" delay={150}>
          <InfoRow label="Phone" value={patient.phone} />
          {patient.address && <InfoRow label="Address" value={patient.address} />}
          <InfoRow label="Gender" value={patient.gender} />
          <InfoRow label="Blood Group" value={patient.bloodGroup ?? 'Not recorded'} />
          <InfoRow label="Registered" value={formatDateTime(patient.createdAt)} />
        </SectionCard>

        {/* Medical Info */}
        <SectionCard title="Medical Information" delay={250}>
          <InfoRow label="Priority Score" value={String(patient.priorityScore)} accent />
          <InfoRow label="Severity" value={patient.severity.toUpperCase()} />
          <InfoRow label="Critical" value={patient.isCritical ? 'Yes — Flagged' : 'No'} accent={patient.isCritical} />
          {patient.assignedDoctor && (
            <InfoRow
              label="Assigned Doctor"
              value={`Dr. ${patient.assignedDoctor.name}`}
            />
          )}
          {patient.department && (
            <InfoRow label="Department" value={patient.department.name} />
          )}
        </SectionCard>

        {/* Symptoms */}
        {patient.symptoms.length > 0 && (
          <SectionCard title="Reported Symptoms" delay={350}>
            <View style={styles.symptomsGrid}>
              {patient.symptoms.map((symptom, i) => (
                <View key={i} style={styles.symptomChip}>
                  <Text style={styles.symptomText}>{symptom}</Text>
                </View>
              ))}
            </View>
          </SectionCard>
        )}

        {/* Actions */}
        <Animated.View entering={FadeInDown.delay(450).duration(400)} style={styles.actions}>
          <CustomButton
            title="View Triage Record"
            onPress={() =>
              navigation.navigate(ScreenNames.TRIAGE_RECORD, {
                patientId: patient.id,
              })
            }
            variant="outline"
          />
          {patient.isCritical && (
            <CustomButton
              title="⚠ Mark as Critical Alert"
              onPress={() => {}}
              variant="danger"
            />
          )}
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
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.base,
    color: Colors.textMuted,
  },
  scrollContent: {
    paddingBottom: D.spacing.xxxl,
    gap: D.spacing.sm,
    paddingTop: D.spacing.sm,
  },
  heroCard: {
    marginHorizontal: D.spacing.base,
    backgroundColor: Colors.backgroundCard,
    borderRadius: D.radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  heroAccentBar: {
    height: 3,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: D.spacing.base,
    gap: D.spacing.sm,
  },
  heroAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  criticalPulse: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.critical,
    borderWidth: 2,
    borderColor: Colors.backgroundCard,
  },
  heroAvatarText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.lg,
  },
  heroInfo: {
    flex: 1,
    gap: 2,
  },
  heroName: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xl,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  heroMeta: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.sm,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  heroId: {
    fontFamily: Fonts.Medium,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: D.spacing.sm,
    paddingVertical: 5,
    borderRadius: D.radius.sm,
    borderWidth: 1,
  },
  criticalIcon: {
    fontSize: 10,
    color: Colors.critical,
  },
  heroBadgeText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xs,
    letterSpacing: 0.5,
  },
  queueStrip: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: D.spacing.md,
  },
  queueStripItem: {
    flex: 1,
    alignItems: 'center',
  },
  queueStripValue: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.lg,
    color: Colors.primary,
  },
  queueStripLabel: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  queueStripDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  sectionCard: {
    marginHorizontal: D.spacing.base,
    backgroundColor: Colors.backgroundCard,
    borderRadius: D.radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: D.spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: D.spacing.md,
    gap: D.spacing.sm,
  },
  sectionTitle: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.base,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  infoLabel: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.sm,
    color: Colors.textMuted,
  },
  infoValue: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.sm,
    color: Colors.textPrimary,
    textTransform: 'capitalize',
    maxWidth: '60%',
    textAlign: 'right',
  },
  infoValueAccent: {
    color: Colors.primary,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: D.spacing.sm,
  },
  symptomChip: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: D.radius.full,
    paddingHorizontal: D.spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  symptomText: {
    fontFamily: Fonts.Medium,
    fontSize: D.fontSize.sm,
    color: Colors.textSecondary,
  },
  actions: {
    marginHorizontal: D.spacing.base,
    gap: D.spacing.sm,
  },
  editButton: {
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: D.radius.sm,
    paddingHorizontal: D.spacing.md,
    paddingVertical: 5,
  },
  editButtonText: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.sm,
    color: Colors.textSecondary,
  },
});

export default PatientDetailScreen;