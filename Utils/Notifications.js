import * as Notifications from 'expo-notifications';
import { Warn } from './Toast';

Notifications.setNotificationHandler({
  handleNotification: () => ({
    shouldShowAlert: true,
  }),
});

async function Notify(timeleft = 1, text = 'Forge is ready', noToast = 0) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Forge',
      body: text,
      priority: 'max',
      data: { data: 'collect forge' },
    },
    trigger: { seconds: timeleft },
  });
  if (!noToast) {
    setTimeout(() => {
      Warn('Notification set');
    }, 5000);
  }
}

async function ClearNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export { Notify, ClearNotifications };
