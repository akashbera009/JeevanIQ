import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { ScreenNames } from './screenNames';

export const deepLinkConfig: LinkingOptions<RootStackParamList> = {
  prefixes: ['jeevaniq://', 'https://jeevaniq.com'],
  config: {
    screens: {
      [ScreenNames.AUTH_NAVIGATOR]: {
        screens: {
          [ScreenNames.LOGIN]: 'login',
        },
      },
      [ScreenNames.BOTTOM_TAB_NAVIGATOR]: {
        screens: {
          [ScreenNames.HOME_TAB]: {
            screens: {
              [ScreenNames.HOME]: 'home',
              [ScreenNames.NOTIFICATIONS]: 'notifications',
            },
          },
          [ScreenNames.QUEUE_TAB]: {
            screens: {
              [ScreenNames.QUEUE_LIST]: 'queue',
              [ScreenNames.QUEUE_DETAIL]: 'queue/:queueId',
            },
          },
          [ScreenNames.PATIENTS_TAB]: {
            screens: {
              [ScreenNames.PATIENT_LIST]: 'patients',
              [ScreenNames.PATIENT_DETAIL]: 'patients/:patientId',
            },
          },
          [ScreenNames.DOCTORS_TAB]: {
            screens: {
              [ScreenNames.DOCTOR_LIST]: 'doctors',
              [ScreenNames.DOCTOR_DETAIL]: 'doctors/:doctorId',
            },
          },
        },
      },
    },
  },
};