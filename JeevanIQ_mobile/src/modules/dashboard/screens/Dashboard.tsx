import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { fetchDashboardMetricsAction } from '../dashboardSlice';
import Colors from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import D from '../../../utils/dimensions';
import CustomHeader from '../../../components/CustomHeader';

const AnalyticsCard: React.FC<{
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  delay?: number;
}> = ({ label, value, sub, accent = Colors.primary, delay = 0 }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={[styles.cardValue, { color: accent }]}>{value}</Text>
    {sub ? <Text style={styles.cardSub}>{sub}</Text> : null}
  </Animated.View>
);

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { metrics, isLoading } = useAppSelector(s => s.dashboard);

  const loadData = useCallback(() => {
    dispatch(fetchDashboardMetricsAction());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Hospital"
        titleAccent="Analytics"
        subtitle="Real-time performance metrics"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadData}
            tintColor={Colors.primary}
          />
        }>
        <View style={styles.grid}>
          <AnalyticsCard
            label="Total Patients"
            value={metrics?.totalPatients ?? 0}
            sub="Lifetime records"
            delay={100}
          />
          <AnalyticsCard
            label="Served Today"
            value={metrics?.servedToday ?? 0}
            accent={Colors.success}
            sub="Completed visits"
            delay={150}
          />
          <AnalyticsCard
            label="Avg Wait Time"
            value={`${metrics?.avgWaitTime ?? 0}m`}
            accent={Colors.warning}
            sub="Current average"
            delay={200}
          />
          <AnalyticsCard
            label="Critical Cases"
            value={metrics?.criticalCases ?? 0}
            accent={Colors.critical}
            sub="Action required"
            delay={250}
          />
          <AnalyticsCard
            label="Active Doctors"
            value={metrics?.availableDoctors ?? 0}
            sub="On duty now"
            delay={300}
          />
          <AnalyticsCard
            label="Busiest Dept"
            value={metrics?.busiestDepartment || 'N/A'}
            accent={Colors.info}
            sub="High traffic"
            delay={350}
          />
        </View>

        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>Weekly Traffic Trend</Text>
          <View style={styles.barContainer}>
            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
              <View key={i} style={[styles.bar, { height: h }]} />
            ))}
          </View>
          <View style={styles.daysContainer}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <Text key={i} style={styles.dayText}>{d}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: D.spacing.base,
    paddingBottom: D.spacing.xxxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: D.spacing.md,
  },
  card: {
    width: (D.SCREEN_WIDTH - D.spacing.base * 2 - D.spacing.md) / 2,
    backgroundColor: Colors.backgroundCard,
    borderRadius: D.radius.lg,
    padding: D.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardLabel: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.sm,
    color: Colors.textMuted,
  },
  cardValue: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xxl,
    marginTop: 4,
  },
  cardSub: {
    fontFamily: Fonts.Regular,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
  chartPlaceholder: {
    marginTop: D.spacing.xl,
    backgroundColor: Colors.backgroundCard,
    borderRadius: D.radius.xl,
    padding: D.spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  placeholderText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.lg,
    color: Colors.textPrimary,
    marginBottom: D.spacing.xl,
    textAlign: 'center',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    paddingHorizontal: D.spacing.sm,
  },
  bar: {
    width: 20,
    backgroundColor: Colors.primary + '88',
    borderRadius: D.radius.xs,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: D.spacing.md,
    paddingHorizontal: D.spacing.sm,
  },
  dayText: {
    fontFamily: Fonts.Bold,
    fontSize: 10,
    color: Colors.textMuted,
    width: 20,
    textAlign: 'center',
  },
});

export default Dashboard;
