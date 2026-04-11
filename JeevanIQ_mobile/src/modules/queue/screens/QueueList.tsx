import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector, useInterval } from '../../../utils/hooks';
import { fetchQueueAction } from '../queueSlice';
import { QueueEntry } from '../../../utils/types';
import Colors from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import D from '../../../utils/dimensions';
import Strings from '../../../utils/strings';
import {
  getSeverityColor,
  getSeverityMutedColor,
  formatWaitTime,
  formatTime,
  getInitials,
} from '../../../utils/commonFunctions';
import { QUEUE_REFRESH_INTERVAL } from '../../../utils/constants';
import CustomHeader from '../../../components/CustomHeader';
import { showSuccess } from '../../../utils/showSnackbar';

const QueueCard: React.FC<{
  entry: QueueEntry;
  index: number;
  onMarkServed: () => void;
}> = ({ entry, index, onMarkServed }) => {
  const severityColor = getSeverityColor(entry.patient.severity);
  const severityBg = getSeverityMutedColor(entry.patient.severity);
  const isCritical = entry.patient.isCritical;

  return (
    <Animated.View entering={FadeInLeft.delay(index * 60).duration(380)}>
      <View style={[styles.card, isCritical && styles.cardCritical]}>
        {/* Position indicator */}
        <View style={[styles.positionBlock, { borderColor: severityColor }]}>
          <Text style={[styles.positionNumber, { color: severityColor }]}>
            #{entry.position}
          </Text>
          {isCritical && <Text style={styles.criticalBadge}>!</Text>}
        </View>

        {/* Patient info */}
        <View style={styles.cardBody}>
          <View style={styles.nameRow}>
            <Text style={styles.patientName} numberOfLines={1}>
              {entry.patient.name}
            </Text>
            <View style={[styles.severityChip, { backgroundColor: severityBg }]}>
              <Text style={[styles.severityChipText, { color: severityColor }]}>
                {entry.patient.severity.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.metaText}>
            {entry.patient.age}y • {entry.patient.gender} • Checked in{' '}
            {formatTime(entry.checkInTime)}
          </Text>

          {entry.doctor ? (
            <Text style={styles.doctorText}>Dr. {entry.doctor.name}</Text>
          ) : (
            <Text style={styles.noDoctorText}>No doctor assigned</Text>
          )}
        </View>

        {/* Right: wait + action */}
        <View style={styles.cardRight}>
          <View style={styles.waitBlock}>
            <Text style={[styles.waitValue, { color: severityColor }]}>
              {formatWaitTime(entry.estimatedWaitTime)}
            </Text>
            <Text style={styles.waitLabel}>Est. Wait</Text>
          </View>

          <TouchableOpacity
            style={styles.servedButton}
            onPress={onMarkServed}
            activeOpacity={0.75}>
            <Text style={styles.servedButtonText}>✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const QueueListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { entries, isLoading, lastUpdated } = useAppSelector(s => s.queue);

  const loadQueue = useCallback(() => {
    dispatch(fetchQueueAction());
  }, [dispatch]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  useInterval(loadQueue, QUEUE_REFRESH_INTERVAL);

  const handleMarkServed = async (queueId: string) => {
    // const result = await dispatch(markServedAction(queueId));
    // if (markServedAction.fulfilled.match(result)) {
    //   showSuccess('Patient marked as served');
    // }
  };

  const criticalCount = entries.filter(e => e.patient.isCritical).length;

  return (
    <View style={styles.container}>
      <CustomHeader
        title={Strings.liveQueue}
        subtitle={
          lastUpdated
            ? `Updated ${formatTime(lastUpdated)}`
            : 'Fetching...'
        }
        rightElement={
          criticalCount > 0 ? (
            <View style={styles.criticalBadgeContainer}>
              <Text style={styles.criticalBadgeText}>{criticalCount} critical</Text>
            </View>
          ) : undefined
        }
      />

      {/* Summary strip */}
      <Animated.View entering={FadeInDown.delay(50).duration(350)} style={styles.summaryStrip}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{entries.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: Colors.critical }]}>{criticalCount}</Text>
          <Text style={styles.summaryLabel}>Critical</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {entries.filter(e => e.doctor).length}
          </Text>
          <Text style={styles.summaryLabel}>Assigned</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: Colors.warning }]}>
            {entries.filter(e => !e.doctor).length}
          </Text>
          <Text style={styles.summaryLabel}>Unassigned</Text>
        </View>
      </Animated.View>

      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadQueue}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>✅</Text>
              <Text style={styles.emptyTitle}>Queue is empty</Text>
              <Text style={styles.emptySubtitle}>All patients have been served</Text>
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <QueueCard
            entry={item}
            index={index}
            onMarkServed={() => handleMarkServed(item.id)}
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
  criticalBadgeContainer: {
    backgroundColor: Colors.criticalMuted,
    borderRadius: D.radius.full,
    paddingHorizontal: D.spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.critical,
  },
  criticalBadgeText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xs,
    color: Colors.critical,
  },
  summaryStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: D.spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.xl,
    color: Colors.primary,
  },
  summaryLabel: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  summaryDivider: {
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
    padding: D.spacing.md,
    gap: D.spacing.sm,
  },
  cardCritical: {
    borderColor: Colors.critical + '44',
    backgroundColor: Colors.criticalMuted,
  },
  positionBlock: {
    width: 44,
    height: 44,
    borderRadius: D.radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundElevated,
    position: 'relative',
  },
  positionNumber: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.base,
  },
  criticalBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.critical,
    borderWidth: 1.5,
    borderColor: Colors.backgroundCard,
    textAlign: 'center',
    fontFamily: Fonts.Bold,
    fontSize: 9,
    color: Colors.white,
    lineHeight: 11,
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: D.spacing.sm,
  },
  patientName: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.base,
    color: Colors.textPrimary,
    flex: 1,
  },
  severityChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: D.radius.xs,
  },
  severityChipText: {
    fontFamily: Fonts.Bold,
    fontSize: 9,
    letterSpacing: 0.3,
  },
  metaText: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  doctorText: {
    fontFamily: Fonts.Medium,
    fontSize: D.fontSize.xs,
    color: Colors.success,
  },
  noDoctorText: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.warning,
  },
  cardRight: {
    alignItems: 'center',
    gap: D.spacing.sm,
  },
  waitBlock: {
    alignItems: 'center',
  },
  waitValue: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.lg,
  },
  waitLabel: {
    fontFamily: Fonts.Regular,
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
  servedButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.successMuted,
    borderWidth: 1,
    borderColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servedButtonText: {
    fontSize: 14,
    color: Colors.success,
    fontFamily: Fonts.Bold,
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
    marginBottom: D.spacing.sm,
  },
  emptySubtitle: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.sm,
    color: Colors.textMuted,
  },
});

export default QueueListScreen;