import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../utils/hooks';
import { fetchPatientsAction, setFilters } from '../patientSlice';
import { Patient, PatientStackParamList, SeverityLevel } from '../../../utils/types';
import { ScreenNames } from '../../../utils/screenNames';
import Colors from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import D from '../../../utils/dimensions';
import Strings from '../../../utils/strings';
import {
  getSeverityColor,
  getSeverityMutedColor,
  formatWaitTime,
  getInitials,
} from '../../../utils/commonFunctions';
import CustomHeader from '../../../components/CustomHeader';

const SEVERITY_FILTERS: Array<{ label: string; value: SeverityLevel | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const PatientCard: React.FC<{
  patient: Patient;
  index: number;
  onPress: () => void;
}> = ({ patient, index, onPress }) => {
  const severityColor = getSeverityColor(patient.severity);
  const severityBg = getSeverityMutedColor(patient.severity);

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(350)}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
        {/* Left severity bar */}
        <View style={[styles.severityBar, { backgroundColor: severityColor }]} />

        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: severityBg, borderColor: severityColor }]}>
          {patient.isCritical && <View style={styles.criticalDot} />}
          <Text style={[styles.avatarText, { color: severityColor }]}>
            {/* {getInitials(patient.name)} */}
          </Text>
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.patientName} numberOfLines={1}>
              {patient.name}
            </Text>
            {patient.isFlagged && <Text style={styles.flagIcon}>⚑</Text>}
          </View>
          <Text style={styles.patientMeta}>
            {patient.age}y • {patient.gender} • {patient.bloodGroup ?? '—'}
          </Text>
          {/* {patient?.symptoms && patient?.symptoms?.length > 0 && (
            <Text style={styles.symptoms} numberOfLines={1}>
              {patient?.symptoms?.slice(0, 3)
              ?.join(', ')}
            </Text>
          )} */}
        </View>

        {/* Right side */}
        <View style={styles.cardRight}>
          <View style={[styles.severityBadge, { backgroundColor: severityBg }]}>
            <Text style={[styles.severityLabel, { color: severityColor }]}>
              {/* {patient.severity && patient?.severity.toUpperCase()} */}
            </Text>
          </View>
          {patient.queuePosition != null && (
            <Text style={styles.waitTime}>
              #{patient.queuePosition} · {formatWaitTime(patient.estimatedWaitTime)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const PatientListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
  const { list, isLoading, filters } = useAppSelector(s => s.patients);
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<SeverityLevel | 'all'>('all');

  const loadPatients = useCallback(() => {
    // dispatch(fetchPatientsAction({
    //   filters: activeFilter !== 'all' ? { severity: activeFilter, ...filters } : filters,
    // }));
    dispatch(fetchPatientsAction({}))
  }, [dispatch, activeFilter, filters]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const debouncedSearch = useDebounce((text: string) => {
    dispatch(setFilters({ search: text }));
    // dispatch(fetchPatientsAction({ filters: { search: text } }));
  }, 400);

  const handleSearch = (text: string) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleFilterPress = (value: SeverityLevel | 'all') => {
    setActiveFilter(value);
    // dispatch(fetchPatientsAction({
    //   filters: value !== 'all' ? { severity: value } : {},
    // }));
  };
console.log('list i s' , list);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={Strings.patients}
        subtitle={`${list.length} records`}
        rightElement={
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenNames.PATIENT_ADD)}
            style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        }
      />

      {/* Search Bar */}
      <Animated.View entering={FadeInDown.delay(50).duration(350)} style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          placeholderTextColor={Colors.textMuted}
          value={searchText}
          onChangeText={handleSearch}
          selectionColor={Colors.primary}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => { setSearchText(''); handleSearch(''); }}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Severity Filter Pills */}
      <Animated.View entering={FadeInDown.delay(100).duration(350)}>
        <FlatList
          data={SEVERITY_FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.value}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isActive = activeFilter === item.value;
            const color = item.value === 'all' ? Colors.primary : getSeverityColor(item.value as SeverityLevel);
            return (
              <TouchableOpacity
                onPress={() => handleFilterPress(item.value)}
                style={[
                  styles.filterPill,
                  isActive && { backgroundColor: color + '22', borderColor: color },
                ]}
                activeOpacity={0.75}>
                <Text style={[styles.filterPillText, isActive && { color }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </Animated.View>

      {/* Patient List */}
      <FlatList
        data={list}
        keyExtractor={item => item?.age + item?.gender}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadPatients}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🧑‍⚕️</Text>
              <Text style={styles.emptyTitle}>{Strings.noPatients}</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <PatientCard
            patient={item}
            index={index}
            onPress={() =>
              navigation.navigate(ScreenNames.PATIENT_DETAIL, { patientId: item.id })
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
  addButton: {
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: D.radius.sm,
    paddingHorizontal: D.spacing.sm,
    paddingVertical: 5,
  },
  addButtonText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.sm,
    color: Colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: D.radius.lg,
    marginHorizontal: D.spacing.base,
    marginTop: D.spacing.base,
    marginBottom: D.spacing.sm,
    paddingHorizontal: D.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 46,
    gap: D.spacing.sm,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.Medium,
    fontSize: D.fontSize.base,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 12,
    color: Colors.textMuted,
    paddingHorizontal: 4,
  },
  filterList: {
    paddingHorizontal: D.spacing.base,
    gap: D.spacing.sm,
    paddingBottom: D.spacing.sm,
  },
  filterPill: {
    paddingHorizontal: D.spacing.md,
    paddingVertical: 6,
    borderRadius: D.radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundCard,
  },
  filterPillText: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.sm,
    color: Colors.textMuted,
  },
  listContent: {
    paddingHorizontal: D.spacing.base,
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
    gap: D.spacing.sm,
    paddingRight: D.spacing.md,
    paddingVertical: D.spacing.md,
  },
  severityBar: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginLeft: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  criticalDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.critical,
    borderWidth: 1.5,
    borderColor: Colors.backgroundCard,
    zIndex: 1,
  },
  avatarText: {
    fontFamily: Fonts.Bold,
    fontSize: D.fontSize.base,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  patientName: {
    fontFamily: Fonts.SemiBold,
    fontSize: D.fontSize.base,
    color: Colors.textPrimary,
    flex: 1,
  },
  flagIcon: {
    fontSize: 12,
    color: Colors.warning,
  },
  patientMeta: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  symptoms: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 5,
    minWidth: 70,
  },
  severityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: D.radius.xs,
  },
  severityLabel: {
    fontFamily: Fonts.Bold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  waitTime: {
    fontFamily: Fonts.Medium,
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
    marginBottom: D.spacing.sm,
  },
  emptySubtitle: {
    fontFamily: Fonts.Regular,
    fontSize: D.fontSize.sm,
    color: Colors.textMuted,
  },
});

export default PatientListScreen;