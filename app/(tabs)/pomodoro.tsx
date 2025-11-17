// Load notifee dynamically to avoid runtime errors when running in Expo Go / non-ejected environments
// We use eval('require') to avoid Metro statically resolving the native module at bundle time.
const loadNotifee = () => {
  try {
    // eslint-disable-next-line no-eval, @typescript-eslint/no-implied-eval
    const req: any = eval("require");
    return req('@notifee/react-native');
  } catch (e) {
    return null;
  }
};
import { useTheme } from '@/hooks/theme-context';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from "react-native";

// (channel creation moved inside the component)

export default function App() {
  // criar canal Android somente quando o componente montar
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        try {
          const nf = loadNotifee();
          if (nf && nf.createChannel) {
            await nf.createChannel({
              id: 'pomodoro',
              name: 'Pomodoro',
              importance: nf.AndroidImportance ? nf.AndroidImportance.HIGH : undefined,
              vibration: true,
              vibrationPattern: [0, 250, 250, 250],
            });
          }
          else {
            // fallback: create channel using expo-notifications when notifee isn't available
            try {
              await Notifications.setNotificationChannelAsync('pomodoro', {
                name: 'Pomodoro',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
              });
            } catch (e) {
              // ignore
            }
          }
        } catch (e) {
          console.log('Erro ao criar canal de notificações (notifee):', e);
        }
      }
    })();
  }, []);

  // ======= CONFIGURAÇÕES DO USUÁRIO =======
  const [focusMinutes, setFocusMinutes] = useState("25");
  const [focusSeconds, setFocusSeconds] = useState("0");
  const [breakMinutes, setBreakMinutes] = useState("5");
  const [breakSeconds, setBreakSeconds] = useState("0");
  const [totalCycles, setTotalCycles] = useState("4");

  // ======= ESTADOS INTERNOS =======
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusTime, setIsFocusTime] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationIdRef = useRef<string | null>(null);

  // ======= FUNÇÕES PRINCIPAIS =======

  const startTimer = () => {
    if (isRunning) return;
    const seconds = getPhaseSeconds();
    setRemainingSeconds(seconds);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    // parar foreground service + cancelar notificação (se disponível)
    try {
      const nf = loadNotifee();
      if (nf) {
        nf.stopForegroundService && nf.stopForegroundService().catch(() => {});
        nf.cancelNotification && nf.cancelNotification('pomodoro_notification').catch(() => {});
      }
      // fallback: dismiss expo notification if used
      if (notificationIdRef.current) {
        try {
          Notifications.dismissNotificationAsync(notificationIdRef.current).catch(() => {});
        } catch (e) {}
        notificationIdRef.current = null;
      }
    } catch (e) {}
  };

  const resetTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setIsFocusTime(true);
    setRemainingSeconds(0);
    setCurrentCycle(1);
    // parar foreground service + cancelar notificação (se disponível)
    try {
      const nf = loadNotifee();
      if (nf) {
        nf.stopForegroundService && nf.stopForegroundService().catch(() => {});
        nf.cancelNotification && nf.cancelNotification('pomodoro_notification').catch(() => {});
      }
      // fallback: dismiss expo notification if used
      if (notificationIdRef.current) {
        try {
          Notifications.dismissNotificationAsync(notificationIdRef.current).catch(() => {});
        } catch (e) {}
        notificationIdRef.current = null;
      }
    } catch (e) {}
  };

  // Retorna segundos da fase atual (foco ou descanso)
  const getPhaseSeconds = () => {
    const min = isFocusTime ? parseInt(focusMinutes || "0", 10) : parseInt(breakMinutes || "0", 10);
    const sec = isFocusTime ? parseInt(focusSeconds || "0", 10) : parseInt(breakSeconds || "0", 10);
    return min * 60 + sec;
  };

  // Avança para a próxima fase (foco → descanso ou descanso → foco)
  const handlePhaseEnd = () => {
    Vibration.vibrate(400);

    if (isFocusTime) {
      // terminou o foco → vai pro descanso
      setIsFocusTime(false);
      const breakSecs = parseInt(breakMinutes || "0", 10) * 60 + parseInt(breakSeconds || "0", 10);
      setRemainingSeconds(breakSecs);
      setIsRunning(true); // continua rodando automaticamente
    } else {
      // terminou o descanso → verifica se acabou os ciclos
      const totalCyclesNum = parseInt(totalCycles || "1", 10);
      if (currentCycle >= totalCyclesNum) {
        Vibration.vibrate([300, 200, 300]);
        setIsRunning(false);
        setRemainingSeconds(0);
        setIsFocusTime(true);
        setCurrentCycle(1);
        // garantir que a notificação/foreground service seja parada (se disponível)
        try {
          const nf = loadNotifee();
          if (nf) {
            nf.stopForegroundService && nf.stopForegroundService().catch(() => {});
            nf.cancelNotification && nf.cancelNotification('pomodoro_notification').catch(() => {});
          }
        } catch (e) {}
        return;
      }
      // inicia novo ciclo
      const nextCycle = currentCycle + 1;
      setCurrentCycle(nextCycle);
      setIsFocusTime(true);
      const focusSecs = parseInt(focusMinutes || "0", 10) * 60 + parseInt(focusSeconds || "0", 10);
      setRemainingSeconds(focusSecs);
      setIsRunning(true); // continua rodando automaticamente
    }
  };

  // Controle do tempo em contagem regressiva
  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current);
            }
            handlePhaseEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isFocusTime, focusMinutes, focusSeconds, breakMinutes, breakSeconds, totalCycles, currentCycle]);

  // Notificação do timer ativo via Notifee (notificação fixa/updatable)
  useEffect(() => {
    let mounted = true;
    const notifId = 'pomodoro_notification';

    (async () => {
      try {
        if (isRunning && remainingSeconds > 0) {
          const min = Math.floor(remainingSeconds / 60);
          const sec = remainingSeconds % 60;
            const timeDisplay = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
          const phase = isFocusTime ? "🎯 Foco" : "😎 Descanso";

          // Display (or update) a persistent notification with the same id
          const nf = loadNotifee();
          if (nf && nf.displayNotification) {
            await nf.displayNotification({
              id: notifId,
              title: phase,
              body: `Tempo restante: ${timeDisplay}`,
              android: {
                channelId: 'pomodoro',
                ongoing: true,
                asForegroundService: true,
                smallIcon: 'ic_stat_pomodoro', // requires icon in native resources
              },
            });

            if (mounted) notificationIdRef.current = notifId;
          } else {
            // Fallback: use expo-notifications when notifee isn't present (Expo Go / non-ejected)
            try {
              // dismiss previous expo notification (if any) to avoid duplicates
              if (notificationIdRef.current) {
                await Notifications.dismissNotificationAsync(notificationIdRef.current).catch(() => {});
              }

              const expoId = await Notifications.scheduleNotificationAsync({
                content: {
                  title: phase,
                  body: `Tempo restante: ${timeDisplay}`,
                  data: { pomodoro: true },
                  android: {
                    channelId: 'pomodoro',
                    // sticky/ongoing isn't supported uniformly; we set importance and keep re-presenting to simulate update
                    importance: Notifications.AndroidImportance.MAX,
                  },
                },
                trigger: null,
              });

              if (mounted) notificationIdRef.current = expoId;
            } catch (e) {
              // ignore expo fallback errors
            }
          }
        } else {
          // cancelar notificação quando não estiver rodando (se disponível)
          const nf = loadNotifee();
          if (nf && nf.cancelNotification) {
            await nf.cancelNotification(notifId).catch(() => {});
          }
          // fallback: dismiss expo notification
          if (notificationIdRef.current) {
            try {
              await Notifications.dismissNotificationAsync(notificationIdRef.current).catch(() => {});
            } catch (e) {}
          }
          notificationIdRef.current = null;
        }
      } catch (e) {
        console.log('Erro ao mostrar/atualizar notificação (notifee):', e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [remainingSeconds, isRunning, isFocusTime]);

  // ======= INTERFACE =======
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.header, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Pomodoro</Text>
        <Text style={[styles.phaseStatus, { color: colors.secondaryText }]}>
          {isFocusTime ? "🎯 Foco" : "😎 Descanso"} • Ciclo {currentCycle}/{totalCycles}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* DIAL COM TEMPO */}
        <View style={styles.dialContainer}>
          <Image
            source={require("../../assets/images/pomodoro_dial.png")}
            style={styles.dialImage}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              pauseTimer();
              setRemainingSeconds(0);
            }}
            style={styles.timerOverlay}
          >
            <Text style={styles.timerText}>
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONFIGURAÇÕES */}
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.settingsTitle, { color: colors.text }]}>Configurações</Text>

          {/* Tempo de foco */}
          <View style={styles.settingSection}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Tempo de foco</Text>
            <View style={styles.timeInputRow}>
              <TextInput
                style={[styles.timeInput, { backgroundColor: colors.header, color: colors.text, borderColor: colors.border }]}
                value={focusMinutes}
                onChangeText={setFocusMinutes}
                keyboardType="numeric"
                placeholder="25"
                placeholderTextColor={colors.secondaryText}
              />
              <Text style={[styles.timeSeparator, { color: colors.text }]}>:</Text>
              <TextInput
                style={[styles.timeInput, { backgroundColor: colors.header, color: colors.text, borderColor: colors.border }]}
                value={focusSeconds}
                onChangeText={setFocusSeconds}
                keyboardType="numeric"
                placeholder="00"
                placeholderTextColor={colors.secondaryText}
                maxLength={2}
              />
            </View>
          </View>

          {/* Tempo de descanso */}
          <View style={styles.settingSection}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Tempo de descanso</Text>
            <View style={styles.timeInputRow}>
              <TextInput
                style={[styles.timeInput, { backgroundColor: colors.header, color: colors.text, borderColor: colors.border }]}
                value={breakMinutes}
                onChangeText={setBreakMinutes}
                keyboardType="numeric"
                placeholder="05"
                placeholderTextColor={colors.secondaryText}
              />
              <Text style={[styles.timeSeparator, { color: colors.text }]}>:</Text>
              <TextInput
                style={[styles.timeInput, { backgroundColor: colors.header, color: colors.text, borderColor: colors.border }]}
                value={breakSeconds}
                onChangeText={setBreakSeconds}
                keyboardType="numeric"
                placeholder="00"
                placeholderTextColor={colors.secondaryText}
                maxLength={2}
              />
            </View>
          </View>

          {/* Ciclos */}
          <View style={styles.settingSection}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Número de ciclos</Text>
            <TextInput
              style={[styles.cyclesInput, { backgroundColor: colors.header, color: colors.text, borderColor: colors.border }]}
              value={totalCycles}
              onChangeText={setTotalCycles}
              keyboardType="numeric"
              placeholder="4"
              placeholderTextColor={colors.secondaryText}
            />
          </View>
        </View>

        {/* BOTÕES DE CONTROLE */}
        <View style={styles.buttons}>
          {!isRunning ? (
            <TouchableOpacity
              onPress={startTimer}
              style={[styles.button, styles.startButton]}
            >
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

// ======= ESTILOS =======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  phaseStatus: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // DIAL COM TEMPO
  dialContainer: {
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  dialImage: {
    width: 240,
    height: 240,
    resizeMode: "contain",
  },
  timerOverlay: {
    position: "absolute",
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 64,
    fontWeight: "300",
    color: "#fff",
  },

  // SETTINGS CARD
  settingsCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  settingSection: {
    marginBottom: 18,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  timeInputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  timeInput: {
    width: 70,
    height: 44,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  cyclesInput: {
    width: 100,
    height: 44,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    alignSelf: "center",
  },

  // BUTTONS
  buttons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 140,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  pauseButton: {
    backgroundColor: "#ff6b6b",
  },
  resetButton: {
    backgroundColor: "#999",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
});
