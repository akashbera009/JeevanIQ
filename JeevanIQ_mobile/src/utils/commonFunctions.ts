import { SeverityLevel } from './types';
import Colors from './colors';

/**
 * Returns a greeting based on current hour
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

/**
 * Format waiting time in minutes to human-readable string
 */
export const formatWaitTime = (minutes: number): string => {
  if (minutes < 1) return 'Now';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

/**
 * Format ISO date string to readable format
 */
export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format ISO date string to time
 */
export const formatTime = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format ISO to date + time
 */
export const formatDateTime = (iso: string): string =>
  `${formatDate(iso)}, ${formatTime(iso)}`;

/**
 * Get color for severity level
 */
export const getSeverityColor = (severity: SeverityLevel): string => {
  switch (severity) {
    case 'critical':
      return Colors.critical;
    case 'high':
      return Colors.high;
    case 'medium':
      return Colors.medium;
    case 'low':
      return Colors.low;
    default:
      return Colors.textMuted;
  }
};

/**
 * Get background muted color for severity level
 */
export const getSeverityMutedColor = (severity: SeverityLevel): string => {
  switch (severity) {
    case 'critical':
      return Colors.criticalMuted;
    case 'high':
      return Colors.highMuted;
    case 'medium':
      return Colors.mediumMuted;
    case 'low':
      return Colors.lowMuted;
    default:
      return Colors.primaryMuted;
  }
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
};

/**
 * Mask phone number for display
 */
export const maskPhone = (phone: string): string => {
  if (phone.length < 4) return phone;
  return `${phone.slice(0, -4).replace(/\d/g, '*')}${phone.slice(-4)}`;
};

/**
 * Check if symptom combo is critical
 */
export const isCriticalSymptomCombo = (symptoms: string[]): boolean => {
  const criticalCombos = [
    ['Chest Pain', 'Breathlessness'],
    ['Chest Pain', 'Dizziness'],
    ['Breathlessness', 'Fatigue'],
  ];
  return criticalCombos.some(combo =>
    combo.every(symptom => symptoms.includes(symptom)),
  );
};

/**
 * Calculate priority score
 */
export const calculatePriorityScore = (
  severity: SeverityLevel,
  waitingMinutes: number,
  isDoctorAvailable: boolean,
): number => {
  const severityWeights = {
    critical: 100,
    high: 70,
    medium: 40,
    low: 10,
  };
  const severityScore = severityWeights[severity];
  const waitScore = Math.min(waitingMinutes * 0.5, 50);
  const availabilityBonus = isDoctorAvailable ? 0 : 20;
  return Math.round(severityScore + waitScore + availabilityBonus);
};

/**
 * Validate phone number (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Generate a simple unique ID (for local use)
 */
export const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);