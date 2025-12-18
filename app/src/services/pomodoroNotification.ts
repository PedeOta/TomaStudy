import notifee, {
  AndroidImportance,
  AndroidColor,
} from '@notifee/react-native';

const CHANNEL_ID = 'pomodoro';
const NOTIFICATION_ID = 'pomodoro_notification';

let foregroundStarted = false;

export async function showPomodoroNotification(params: {
  phase: 'FOCUS' | 'BREAK';
  remainingSeconds: number;
  totalSeconds: number;
  currentCycle: number;
  totalCycles: number;
}) {
  const {
    phase,
    remainingSeconds,
    totalSeconds,
    currentCycle,
    totalCycles,
  } = params;

  await notifee.requestPermission();

  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Pomodoro',
    importance: AndroidImportance.HIGH,
  });

  const min = Math.floor(remainingSeconds / 60);
  const sec = remainingSeconds % 60;
  const time = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

  const progress =
    totalSeconds > 0
      ? Math.floor(
          ((totalSeconds - remainingSeconds) / totalSeconds) * 100
        )
      : 0;

  await notifee.displayNotification({
    id: NOTIFICATION_ID,
    title:
      phase === 'FOCUS'
        ? `🎯 Foco • Ciclo ${currentCycle}/${totalCycles}`
        : `😎 Descanso • Ciclo ${currentCycle}/${totalCycles}`,
    body: `Tempo restante: ${time}`,
    android: {
      channelId: CHANNEL_ID,
      smallIcon: 'ic_launcher',
      ongoing: true,
      asForegroundService: !foregroundStarted,
      progress: {
        max: 100,
        current: progress,
        indeterminate: false,
      },
      color: AndroidColor.RED,
    },
  });

  foregroundStarted = true;
}

export async function stopPomodoroNotification() {
  foregroundStarted = false;
  await notifee.stopForegroundService();
  await notifee.cancelNotification(NOTIFICATION_ID);
}
