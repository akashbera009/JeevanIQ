import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector, useInterval } from '../../../utils/hooks';
import { fetchDashboardMetricsAction, fetchCriticalCasesAction } from '../../dashboard/dashboardSlice';
import { fetchQueueAction } from '../../queue/queueSlice';
import Colors from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import D from '../../../utils/dimensions';
import Strings from '../../../utils/strings';
import { getGreeting, getSeverityColor, formatWaitTime } from '../../../utils/commonFunctions';
import { DASHBOARD_REFRESH_INTERVAL } from '../../../utils/constants';
import CustomHeader from '../../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../../../utils/screenNames';

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  delay?: number;
}> = ({ label, value, sub, accent = Colors.primary, delay = 0 }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.metricCard}>
    <View style={[styles.metricAccentBar, { backgroundColor: accent }]} />
    <Text style={[styles.metricValue, { color: accent }]}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
    {sub ? <Text style={styles.metricSub}>{sub}</Text> : null}
  </Animated.View>
);

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { user } = useAppSelector(s => s.auth);
  const { metrics, criticalCases, isLoading } = useAppSelector(s => s.dashboard);
  const { entries: queueEntries } = useAppSelector(s => s.queue);

  const loadData = useCallback(() => {
    dispatch(fetchDashboardMetricsAction());
    dispatch(fetchCriticalCasesAction());
    dispatch(fetchQueueAction());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useInterval(loadData, DASHBOARD_REFRESH_INTERVAL);

  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] ?? 'Doctor';

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Jeevan"
        titleAccent="IQ"
        subtitle="Hospital Intelligence System"
        rightElement={
          <TouchableOpacity style={styles.notifButton}>
            <Text style={styles.notifIcon}>🔔</Text>
            {criticalCases.length > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{criticalCases.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadData}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }>

        {/* Greeting */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingTime}>{greeting},</Text>
            <Text style={styles.greetingName}>Dr. {firstName}</Text>
          </View>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </Animated.View>

        {/* Critical Alert Banner */}
        {criticalCases.length > 0 &&
          criticalCases.map((caseItem: any, i: number) => (
            <Animated.View
              key={caseItem.id}
              entering={FadeInDown.delay(100 + i * 50).duration(400)}
              style={styles.alertBanner}>
            <Text style={styles.alertIcon}>⚠</Text>
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>
                {criticalCases.length} Critical {criticalCases.length === 1 ? 'Case' : 'Cases'}
              </Text>
              <Text style={styles.alertSub}>Immediate attention required</Text>
            </View>
            <TouchableOpacity 
              style={styles.alertAction}
              onPress={() => navigation.navigate(ScreenNames.PATIENTS_TAB)}>
              <Text style={styles.alertActionText}>View →</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Metrics Grid */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{Strings.todayOverview}</Text>
          <TouchableOpacity onPress={() => navigation.navigate(ScreenNames.DASHBOARD)}>
            <Text style={styles.viewAll}>Analytics →</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.metricsGrid}>
          <MetricCard
            label="Queue Size"
            value={metrics?.queueSize ?? queueEntries.length}
            sub="Active patients"
            accent={Colors.primary}
            delay={200}
          />
          <MetricCard
            label="Critical"
            value={metrics?.criticalCases ?? criticalCases.length}
            sub="Need attention"
            accent={Colors.critical}
            delay={250}
          />
          <MetricCard
            label="Avg Wait"
            value={formatWaitTime(metrics?.avgWaitTime ?? 0)}
            sub="Per patient"
            accent={Colors.warning}
            delay={300}
          />
          <MetricCard
            label="Available"
            value={metrics?.availableDoctors ?? '—'}
            sub="Doctors online"
            accent={Colors.success}
            delay={350}
          />
          <MetricCard
            label="Total Patients"
            value={metrics?.totalPatients ?? '—'}
            sub="Registered"
            accent={Colors.info}
            delay={400}
          />
          <MetricCard
            label="Served Today"
            value={metrics?.servedToday ?? '—'}
            sub="Completed"
            accent={Colors.success}
            delay={450}
          />
        </View>

        {/* Live Queue Preview */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{Strings.liveQueue}</Text>
            <TouchableOpacity onPress={() => navigation.navigate(ScreenNames.QUEUE_TAB)}>
              <Text style={styles.viewAll}>{Strings.viewAll} →</Text>
            </TouchableOpacity>
          </View>

          {queueEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🏥</Text>
              <Text style={styles.emptyText}>{Strings.noPatientsInQueue}</Text>
            </View>
          ) : (
            queueEntries.slice(0, 4).map((entry: any, i: number) => (
              <Animated.View
                key={entry.id}
                entering={FadeInDown.delay(520 + i * 60).duration(350)}
                style={styles.queueCard}>
                <View style={styles.queuePosition}>
                  <Text style={styles.queuePositionText}>#{entry.position}</Text>
                </View>
                <View style={styles.queueInfo}>
                  <Text style={styles.queuePatientName}>{entry.patient.name}</Text>
                  <Text style={styles.queueMeta}>
                    {entry.patient.age}y • {entry.patient.gender}
                  </Text>
                </View>
                <View style={[
                  styles.severityBadge,
                  { backgroundColor: getSeverityColor(entry.patient.severity) + '22' }
                ]}>
                  <Text style={[styles.severityText, { color: getSeverityColor(entry.patient.severity) }]}>
                    {entry.patient.severity.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.waitTimeText}>
                  {formatWaitTime(entry.estimatedWaitTime)}
                </Text>
              </Animated.View>
            ))
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: D.spacing.xxxl,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: D.spacing.base,
    paddingTop: D.spacing.lg,
    paddingBottom: D.spacing.base,
  },
  greetingTime: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.sm,
    color: Colors.textMuted,
  },
  greetingName: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xxl,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifIcon: {
    fontSize: 20,
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.critical,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
    paddingHorizontal: 2,
  },
  notifBadgeText: {
    fontFamily: Fonts.Bold,
    fontSize: 10,
    color: 'white',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.successMuted,
    paddingHorizontal: D.spacing.sm,
    paddingVertical: 4,
    borderRadius: D.radius.full,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  liveText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xs,
    color: Colors.success,
    letterSpacing: 1,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.criticalMuted,
    borderWidth: 1,
    borderColor: Colors.critical,
    borderRadius: D.radius.lg,
    marginHorizontal: D.spacing.base,
    marginBottom: D.spacing.base,
    padding: D.spacing.md,
    gap: D.spacing.sm,
  },
  alertIcon: {
    fontSize: 20,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.base,
    color: Colors.critical,
  },
  alertSub: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.critical,
    opacity: 0.7,
  },
  alertAction: {
    paddingHorizontal: D.spacing.sm,
  },
  alertActionText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.sm,
    color: Colors.critical,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: D.spacing.base,
    marginBottom: D.spacing.sm,
    marginTop: D.spacing.base,
  },
  sectionTitle: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.lg,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  viewAll: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.sm,
    color: Colors.primary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: D.spacing.sm,
    gap: D.spacing.sm,
  },
  metricCard: {
    width: (D.SCREEN_WIDTH - D.spacing.sm * 2 - D.spacing.sm * 2) / 2 - D.spacing.sm / 2,
    backgroundColor: Colors.backgroundCard,
    borderRadius: D.radius.lg,
    padding: D.spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  metricAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: D.radius.lg,
    borderTopRightRadius: D.radius.lg,
  },
  metricValue: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xxl,
    marginTop: D.spacing.xs,
  },
  metricLabel: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.sm,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  metricSub: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  queueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: D.radius.lg,
    marginHorizontal: D.spacing.base,
    marginBottom: D.spacing.sm,
    padding: D.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: D.spacing.sm,
  },
  queuePosition: {
    width: 36,
    height: 36,
    borderRadius: D.radius.sm,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  queuePositionText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.sm,
    color: Colors.primary,
  },
  queueInfo: {
    flex: 1,
  },
  queuePatientName: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.base,
    color: Colors.textPrimary,
  },
  queueMeta: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
    textTransform: 'capitalize',
  },
  severityBadge: {
    paddingHorizontal: D.spacing.sm,
    paddingVertical: 3,
    borderRadius: D.radius.xs,
  },
  severityText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xs,
    letterSpacing: 0.5,
  },
  waitTimeText: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.base,
    color: Colors.textSecondary,
    minWidth: 44,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: D.verticalScale(32),
    marginHorizontal: D.spacing.base,
    backgroundColor: Colors.backgroundCard,
    borderRadius: D.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: D.spacing.sm,
  },
  emptyText: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.base,
    color: Colors.textMuted,
  },
});

export default HomeScreen;