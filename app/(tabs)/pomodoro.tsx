// App.js
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

// AsyncStorage is optional — if you want persistence install:
// npm install @react-native-async-storage/async-storage
let OptionalAsyncStorage: any = null;

// Componente principal
export default function App() {
  // Valores iniciais padrão do Pomodoro
  const [minutesInput, setMinutesInput] = useState("25");
  const [secondsInput, setSecondsInput] = useState("00");
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  // rest duration inputs
  const [restMinutesInput, setRestMinutesInput] = useState("05");
  const [restSecondsInput, setRestSecondsInput] = useState("00");
  // interval ref (browser/node compatible)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isInWorkPhase, setIsInWorkPhase] = useState(true);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [totalCycles, setTotalCycles] = useState(4);

  // Convert remainingSeconds to display mm:ss
  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // Start timer using current input values (or resume if paused)
  const handleStart = () => {
    // If already running, do nothing
    if (isRunning) return;

    // If there's no active remainingSeconds, initialize from inputs
    let total = remainingSeconds;
    if (total === null) {
      if (isInWorkPhase) {
        const m = parseInt(minutesInput || "0", 10) || 0;
        let s = parseInt(secondsInput || "0", 10) || 0;
        if (s > 59) s = 59; // clamp
        total = m * 60 + s;
      } else {
        const rm = parseInt(restMinutesInput || "0", 10) || 0;
        let rs = parseInt(restSecondsInput || "0", 10) || 0;
        if (rs > 59) rs = 59;
        total = rm * 60 + rs;
      }
      setRemainingSeconds(total);
    }

    if ((total ?? 0) <= 0) return; // nothing to run

    setIsRunning(true);
    // start interval loop
    startInterval();
  };

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as any);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const startInterval = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          // reached zero: clear this interval and handle phase end
          if (intervalRef.current) {
            clearInterval(intervalRef.current as any);
            intervalRef.current = null;
          }
          handlePhaseEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Esta função gerencia a transição automática entre fases e o incremento do ciclo
  const handlePhaseEnd = () => {
    // Toca som/vibra para sinalizar o fim da fase
    try { feedback(); } catch (e) {}

    // Fim da fase de TRABALHO -> Inicia DESCANSO (mesmo ciclo)
    if (isInWorkPhase) {
      const rm = parseInt(restMinutesInput || "0", 10) || 0;
      let rs = parseInt(restSecondsInput || "0", 10) || 0;
      if (rs > 59) rs = 59;
      const restTotal = rm * 60 + rs;

      setIsInWorkPhase(false); // Transiciona para o descanso

      if (restTotal > 0) {
        setRemainingSeconds(restTotal);
        startInterval(); // Inicia o timer de descanso automaticamente
        setIsRunning(true);
        return;
      }
      // Se restTotal for 0, o fluxo continua para a lógica de fim de descanso.
    }

    // Fim da fase de DESCANSO -> Inicia NOVO TRABALHO (próximo ciclo) ou PARA
    if (!isInWorkPhase) {
      const wm = parseInt(minutesInput || "0", 10) || 0;
      let ws = parseInt(secondsInput || "0", 10) || 0;
      if (ws > 59) ws = 59;
      const workTotal = wm * 60 + ws;

      // 1. Checa se o último ciclo terminou
      if (currentCycle >= totalCycles) {
        // Ciclos concluídos -> para
        setIsRunning(false);
        setRemainingSeconds(null);
        setIsInWorkPhase(true);
        setCurrentCycle(totalCycles);
        return;
      }

      // 2. Inicia o próximo ciclo de trabalho
      setCurrentCycle((c) => c + 1); // <--- ATUALIZA O CICLO AQUI
      setIsInWorkPhase(true); // Volta para a fase de trabalho

      if (workTotal > 0) {
        setRemainingSeconds(workTotal);
        startInterval(); // Inicia o timer de trabalho automaticamente
        setIsRunning(true);
        return;
      }

      // Se workTotal for 0, chama handlePhaseEnd novamente para verificar a condição de parada/próxima transição
      setRemainingSeconds(null);
      setIsRunning(false);
      setTimeout(() => {
        handlePhaseEnd(); 
      }, 0);
    }
  };

  const handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as any);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setRemainingSeconds(null);
    setIsInWorkPhase(true);
    setCurrentCycle(1);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as any);
        intervalRef.current = null;
      }
    };
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [cyclesInput, setCyclesInput] = useState(String(totalCycles));

  const pad = (v: string) => {
    const n = parseInt(v || "0", 10) || 0;
    return String(n).padStart(2, "0");
  };

  // Sound reference
  const [sound, setSound] = useState<Audio.Sound>();

  // Load sound on component mount
  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/timer-end.mp3')
        );
        setSound(sound);
      } catch (e) {
        console.log('Error loading sound:', e);
      }
    })();

    // Cleanup sound on unmount
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // feedback helper (vibration + haptics + sound)
  const feedback = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}
    try {
      Vibration.vibrate(250);
    } catch (e) {}
    try {
      if (sound) {
        await sound.replayAsync(); 
      }
    } catch (e) {
      console.log('Error playing sound:', e);
    }
  };

  // Load persisted settings (if AsyncStorage is installed)
  useEffect(() => {
    (async () => {
      try {
        // dynamic require so app doesn't crash if package isn't installed
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        OptionalAsyncStorage = AsyncStorage;
        const m = await AsyncStorage.getItem('pom_minutes');
        const s = await AsyncStorage.getItem('pom_seconds');
        const rm = await AsyncStorage.getItem('pom_rest_minutes');
        const rs = await AsyncStorage.getItem('pom_rest_seconds');
        const cycles = await AsyncStorage.getItem('pom_cycles');
        if (m !== null) setMinutesInput(m);
        if (s !== null) setSecondsInput(s);
        if (rm !== null) setRestMinutesInput(rm);
        if (rs !== null) setRestSecondsInput(rs);
        if (cycles !== null) setTotalCycles(parseInt(cycles, 10) || 4);
      } catch (e) {
        OptionalAsyncStorage = null;
      }
    })();
  }, []);

  // Persist settings when they change
  useEffect(() => {
    if (!OptionalAsyncStorage) return;
    (async () => {
      try {
        await OptionalAsyncStorage.setItem('pom_minutes', minutesInput);
        await OptionalAsyncStorage.setItem('pom_seconds', secondsInput);
        await OptionalAsyncStorage.setItem('pom_rest_minutes', restMinutesInput);
        await OptionalAsyncStorage.setItem('pom_rest_seconds', restSecondsInput);
        await OptionalAsyncStorage.setItem('pom_cycles', String(totalCycles));
      } catch (e) {
        // ignore
      }
    })();
  }, [minutesInput, secondsInput, restMinutesInput, restSecondsInput, totalCycles]);

  return (
    <View style={styles.container}>
      {/* ---------------- CORPO PRINCIPAL ---------------- */}
      <View style={styles.main}>
        {/* Tomate e tempo */}
        <View style={styles.tomatoContainer}>
          <Image
            source={require("./assets/pomodoro_dial.png")} 
            style={styles.tomatoImage}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // enter edit mode; pause timer so user can edit
              handlePause();
              setIsEditing(true);
              // clear remainingSeconds so inputs show current values
              setRemainingSeconds(null);
            }}
            // Style para preencher a área da imagem e capturar o clique
            style={styles.timerTouchArea as any} 
          >
            <Text style={styles.timerText}>
              {remainingSeconds !== null
                ? formatTime(remainingSeconds)
                : isInWorkPhase
                ? `${pad(minutesInput)}:${pad(secondsInput)}`
                : `${pad(restMinutesInput)}:${pad(restSecondsInput)}`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status da fase */}
        <View style={styles.phaseStatusContainer}>
          <Text style={styles.phaseText}>
            {isInWorkPhase ? "Foco" : "Descanso"}
          </Text>
          <Text style={styles.cycleText}>{`Ciclo ${currentCycle}/${totalCycles}`}</Text>
        </View>

        {/* Edit inputs (show when editing) */}
        {isEditing && (
          <View style={styles.inputsContainer}>
            <Text style={styles.settingsTitle}>Configurações</Text>
            
            <Text style={styles.sectionTitle}>Tempo de Trabalho</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Minutos</Text>
              <TextInput
                value={minutesInput}
                onChangeText={(t: string) => setMinutesInput(t.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                maxLength={3}
                style={styles.input}
                placeholder="25"
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Segundos</Text>
              <TextInput
                value={secondsInput}
                onChangeText={(t: string) => setSecondsInput(t.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                maxLength={2}
                style={styles.input}
                placeholder="00"
                onEndEditing={() => {
                  const s = parseInt(secondsInput || "0", 10) || 0;
                  if (s > 59) setSecondsInput("59");
                }}
              />
            </View>

            <Text style={styles.sectionTitle}>Tempo de Descanso</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Minutos</Text>
              <TextInput
                value={restMinutesInput}
                onChangeText={(t: string) => setRestMinutesInput(t.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                maxLength={3}
                style={styles.input}
                placeholder="05"
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Segundos</Text>
              <TextInput
                value={restSecondsInput}
                onChangeText={(t: string) => setRestSecondsInput(t.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                maxLength={2}
                style={styles.input}
                placeholder="00"
                onEndEditing={() => {
                  const s = parseInt(restSecondsInput || "0", 10) || 0;
                  if (s > 59) setRestSecondsInput("59");
                }}
              />
            </View>

            <Text style={styles.sectionTitle}>Ciclos</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Número de ciclos</Text>
              <TextInput
                value={cyclesInput}
                onChangeText={(t: string) => setCyclesInput(t.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                maxLength={3}
                style={styles.input}
                placeholder="4"
              />
            </View>

            <TouchableOpacity
              style={styles.okButton}
              onPress={() => {
                const parsed = parseInt(cyclesInput || "0", 10) || 1;
                const clamped = parsed < 1 ? 1 : parsed;
                setTotalCycles(clamped);
                setIsEditing(false);
              }}
            >
              <Text style={styles.okText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Botões */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={isRunning ? handleStop : handleStart}>
            <Text style={styles.buttonText}>{isRunning ? "PARAR" : "INICIAR"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePause}>
            <Text style={styles.buttonText}>PAUSAR</Text>
          </TouchableOpacity>
        </View>
        {/* Definir ciclos (abre edição) */}
        <TouchableOpacity
          style={styles.defineButton}
          onPress={() => {
            handlePause();
            setIsEditing(true);
            setCyclesInput(String(totalCycles));
          }}
        >
          <Text style={styles.defineText}>Definir tempos/ciclos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------- ESTILOS ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },

  // CORPO PRINCIPAL
  main: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingTop: 50,
    paddingBottom: 50,
    width: '100%',
  },
  tomatoContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 250,
    height: 250,
    marginTop: 20,
    marginBottom: 20,
  },
  tomatoImage: {
    width: '100%', 
    height: '100%', 
    resizeMode: 'contain',
  },
  timerTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    position: "absolute",
    color: "#000", // Cor preta para o tempo
    fontSize: 42,
    fontWeight: "800",
    textAlign: 'center',
    // Posição ajustada para centralizar o texto dentro da imagem do dial
    top: '47%', 
    transform: [{ translateY: -21 }],
  },
  phaseStatusContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  phaseText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4a4a4a",
    marginBottom: 5,
  },
  cycleText: {
    fontSize: 16,
    color: "#777",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginHorizontal: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  inputsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    width: '90%',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  inputLabel: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  input: {
    width: 80,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    textAlign: "center",
    fontSize: 18,
    padding: 0,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  okButton: {
    backgroundColor: "#4CAF50",
    marginTop: 25,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 15,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  okText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  settingsTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
    marginBottom: 18,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4a4a4a",
    marginTop: 15,
    marginBottom: 10,
  },
  defineButton: {
    marginTop: 15,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  defineText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
  },
});
