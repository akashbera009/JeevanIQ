import { store } from '../store';
import { setToast, clearToast } from '../modals';
import { ToastType } from './types';
import { TOAST_DURATION } from './constants';

let toastTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Show a toast notification globally via Redux
 */
export const showToast = (
  message: string,
  type: ToastType = 'info',
  duration: number = TOAST_DURATION.medium,
): void => {
  // Clear any existing timer
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }

  store.dispatch(setToast({ type, message, duration }));

  toastTimer = setTimeout(() => {
    store.dispatch(clearToast());
    toastTimer = null;
  }, duration);
};

export const showSuccess = (message: string, duration?: number): void =>
  showToast(message, 'success', duration);

export const showError = (message: string, duration?: number): void =>
  showToast(message, 'error', duration ?? TOAST_DURATION.long);

export const showWarning = (message: string, duration?: number): void =>
  showToast(message, 'warning', duration);

export const showInfo = (message: string, duration?: number): void =>
  showToast(message, 'info', duration);