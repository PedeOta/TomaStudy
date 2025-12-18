import { useTheme } from '@/hooks/theme-context';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';

import {
  showPomodoroNotification,
  stopPomodoroNotification,
} from '../src/services/pomodoroNotification';

export default function Pomodoro() {
  const { colors } = useTheme();

  const [focusMinutes, setFocusMinutes] = useState('25');
  const [focusSeconds, setFocusSeconds] = useState('0');
  const [breakMinutes, setBreakMinutes] = useState('5');
  const [breakSeconds, setBreakSeconds] = useState('0');
  const [totalCycles, setTotalCycles] = useState('4');

  const [isRunning, setIsRunning] = useState(false);
  const [isFocusTime, setIsFocusTime] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getPhaseSeconds = () => {
    const min = isFocusTime
      ? parseInt(focusMinutes || '0', 10)
      : parseInt(breakMinutes || '0', 10);
    const sec = isFocusTime
      ? parseInt(focusSeconds || '0', 10)
      : parseInt(breakSeconds || '0', 10);
    return min * 60 + sec;
  };

  const notify = (seconds: number) => {
    showPomodoroNotification({
      phase: isFocusTime ? 'FOCUS' : 'BREAK',
      remainingSeconds: seconds,
      totalSeconds: getPhaseSeconds(),
      currentCycle,
      totalCycles: parseInt(totalCycles || '1', 10),
    });
  };

  const startTimer = () => {
    if (isRunning) return;

    const seconds = getPhaseSeconds();
    setRemainingSeconds(seconds);
    setIsRunning(true);

    notify(seconds);
  };

  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    stopPomodoroNotification();
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsFocusTime(true);
    setRemainingSeconds(0);
    setCurrentCycle(1);
    stopPomodoroNotification();
  };

  const handlePhaseEnd = () => {
    Vibration.vibrate(400);

    if (isFocusTime) {
      setIsFocusTime(false);
      const secs =
        parseInt(breakMinutes || '0', 10) * 60 +
        parseInt(breakSeconds || '0', 10);
      setRemainingSeconds(secs);
      notify(secs);
    } else {
      const total = parseInt(totalCycles || '1', 10);

      if (currentCycle >= total) {
        resetTimer();
        return;
      }

      setCurrentCycle((c) => c + 1);
      setIsFocusTime(true);

      const secs =
        parseInt(focusMinutes || '0', 10) * 60 +
        parseInt(focusSeconds || '0', 10);
      setRemainingSeconds(secs);
      notify(secs);
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          handlePhaseEnd();
          return 0;
        }

        if (prev % 5 === 0) {
          notify(prev);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isFocusTime, currentCycle]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.header, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Pomodoro</Text>
        <Text style={[styles.phaseStatus, { color: colors.secondaryText }]}>
          {isFocusTime ? '🎯 Foco' : '😎 Descanso'} • Ciclo {currentCycle}/{totalCycles}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dialContainer}>
          <Image
            source={require('../../assets/images/pomodoro_dial.png')}
            style={styles.dialImage}
          />
          <View style={styles.timerOverlay}>
            <Text style={styles.timerText}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </Text>
          </View>
        </View>

        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.settingsTitle, { color: colors.text }]}>Configurações</Text>

          <View style={styles.settingSection}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Tempo de foco</Text>
            <View style={styles.timeInputRow}>
              <TextInput
                style={[styles.timeInput, { backgroundColor: colors.header, color: colors.text, borderColor: colors.border }]}
                value={focusMinutes}
                onChangeText={setFocusMinutes}
                keyboardType="numeric"
              />
              <Text style={[styles.timeSeparator, { color: colors.text }]}>:</Text>
              <TextInput
                style={[styles.timeInput, { backgroundColor: colors.header, color: colors.text, borderColor: colors.border }]}
                value={focusSeconds}
                onChangeText={setFocusSeconds}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>

          <View style={styles.settingSection}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Tempo de descanso</Text>
            <View style={styles.timeInputRow}>
              <TextInput
                style={[styles.timeInput, { backgroundColor: colors.header, color: colors.text, borderColor: colors.border }]}
                value={breakMinutes}
                onChangeText={setBreakMinutes}
                keyboardType="numeric"
              />
              <Text style={[styles.timeSeparator, { color: colors.text }]}>:</Text>
              <TextInput
                style={[styles.timeInput, { backgroundColor: colors.header, color: colors.text, borderColor: colors.border }]}
                value={breakSeconds}
                onChangeText={setBreakSeconds}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>

          <View style={styles.settingSection}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Número de ciclos</Text>
            <TextInput
              style={[styles.cyclesInput, { backgroundColor: colors.header, color: colors.text, borderColor: colors.border }]}
              value={totalCycles}
              onChangeText={setTotalCycles}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.buttons}>
          {!isRunning ? (
            <TouchableOpacity onPress={startTimer} style={[styles.button, styles.startButton]}>
              <Text style={styles.buttonText}>▶ INICIAR</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pauseTimer} style={[styles.button, styles.pauseButton]}>
              <Text style={styles.buttonText}>⏸ PAUSAR</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={resetTimer} style={[styles.button, styles.resetButton]}>
            <Text style={styles.buttonText}>↻ RESETAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 1 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  phaseStatus: { fontSize: 16 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  dialContainer: { alignItems: 'center', marginBottom: 40, position: 'relative' },
  dialImage: { width: 240, height: 240, resizeMode: 'contain' },
  timerOverlay: {
    position: 'absolute',
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: { fontSize: 64, fontWeight: '300', color: '#fff' },
  settingsCard: { borderRadius: 20, padding: 20, marginBottom: 30, borderWidth: 1 },
  settingsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  settingSection: { marginBottom: 18 },
  settingLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  timeInputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  timeInput: {
    width: 70,
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  timeSeparator: { fontSize: 24, fontWeight: 'bold' },
  cyclesInput: {
    width: 100,
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
  },
  buttons: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 20 },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 140,
    alignItems: 'center',
  },
  startButton: { backgroundColor: '#4CAF50' },
  pauseButton: { backgroundColor: '#ff6b6b' },
  resetButton: { backgroundColor: '#999' },
  buttonText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
 