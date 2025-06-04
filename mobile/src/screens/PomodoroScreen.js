import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Text, IconButton, ActivityIndicator } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import ApiService from '../services/ApiService';
import { colors } from '../utils/colors';

// Configurar como as notificações devem ser exibidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function PomodoroScreen() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [loading, setLoading] = useState(true);
  const [notificationId, setNotificationId] = useState(null);
  const [stats, setStats] = useState({
    sessionsToday: 0,
    totalSessions: 0,
    timeToday: 0,
    totalTime: 0,
    lastDate: null
  });

  // Solicitar permissão para notificações ao iniciar
  useEffect(() => {
    registerForPushNotificationsAsync();
    loadStats();
  }, []);

  // Cancelar notificação ao sair da tela
  useEffect(() => {
    return () => {
      if (notificationId) {
        Notifications.cancelScheduledNotificationAsync(notificationId);
      }
    };
  }, [notificationId]);

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'Para receber notificações quando o timer terminar, permita as notificações nas configurações.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão para notificações:', error);
    }
  };

  const scheduleNotification = async (duration, sessionType) => {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: sessionType === 'work' ? 'Sessão de Trabalho Concluída!' : 'Pausa Concluída!',
          body: sessionType === 'work' 
            ? 'Parabéns! Você concluiu 25 minutos de foco. Hora de uma pausa!' 
            : 'Pausa terminada! Pronto para mais uma sessão de trabalho?',
          sound: true,
        },
        trigger: {
          seconds: duration,
        },
      });
      
      setNotificationId(id);
      return id;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
    }
  };

  const cancelNotification = async () => {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      setNotificationId(null);
    }
  };

  const triggerHapticFeedback = async () => {
    try {
      // Vibração de sucesso (3 vibrações rápidas)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Vibração adicional mais forte
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 200);
      
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 400);
    } catch (error) {
      console.error('Erro ao executar vibração:', error);
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const [statsResponse, todayResponse] = await Promise.all([
        ApiService.getPomodoroStats(),
        ApiService.getTodayStats()
      ]);
      
      const apiStats = statsResponse.data || {};
      const todayStats = todayResponse.data || {};
      
      setStats({
        sessionsToday: todayStats.sessions || 0,
        totalSessions: apiStats.totalSessions || 0,
        timeToday: todayStats.totalTime || 0,
        totalTime: apiStats.totalTime || 0,
        lastDate: todayStats.date || new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas pomodoro:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async () => {
    if (isWork) {
      try {
        // Vibração e notificação de conclusão
        await triggerHapticFeedback();
        
        // Criar sessão na API
        const sessionData = {
          duration: 25,
          type: 'work'
        };
        
        const response = await ApiService.createPomodoroSession(sessionData);
        
        // Atualizar estatísticas locais
        if (response.stats) {
          setStats({
            sessionsToday: response.stats.sessionsToday || 0,
            totalSessions: response.stats.totalSessions || 0,
            timeToday: response.stats.timeToday || 0,
            totalTime: response.stats.totalTime || 0,
            lastDate: response.stats.lastDate || new Date().toISOString().split('T')[0]
          });
        }
        
        // Mostrar alerta de conclusão
        Alert.alert(
          'Sessão Concluída!',
          'Parabéns! Você concluiu 25 minutos de foco. Hora de uma pausa de 5 minutos!',
          [{ text: 'OK' }]
        );
        
      } catch (error) {
        console.error('Erro ao salvar sessão pomodoro:', error);
        
        // Fallback: atualizar estatísticas localmente
        setStats(prev => ({
          ...prev,
          sessionsToday: prev.sessionsToday + 1,
          totalSessions: prev.totalSessions + 1,
          timeToday: prev.timeToday + 25,
          totalTime: prev.totalTime + 25,
          lastDate: new Date().toISOString().split('T')[0]
        }));
      }
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          completeSession();
          setIsWork(!isWork);
          const newTime = isWork ? 5 : 25;
          setMinutes(newTime);
          setSeconds(0);
          setInitialTime(newTime * 60);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isWork]);

  const toggleTimer = async () => {
    if (!isActive) {
      // Iniciando timer - agendar notificação
      const currentTime = minutes * 60 + seconds;
      const sessionType = isWork ? 'work' : 'break';
      await scheduleNotification(currentTime, sessionType);
      
      // Vibração leve ao iniciar
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      // Pausando timer - cancelar notificação
      await cancelNotification();
      
      // Vibração leve ao pausar
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setIsActive(!isActive);
  };

  const resetTimer = async () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    setIsWork(true);
    setInitialTime(25 * 60);
    
    // Cancelar notificação agendada
    await cancelNotification();
    
    // Vibração média ao resetar
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const formatTime = (min, sec) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const getCurrentTime = () => minutes * 60 + seconds;
  const getProgress = () => ((initialTime - getCurrentTime()) / initialTime) * 100;

  const getSessionText = () => {
    if (isWork) {
      return ['Coding Time', 'Focus Mode'];
    } else {
      return ['Break Time', 'Debug Mode'];
    }
  };

  const [sessionTitle, sessionSubtitle] = getSessionText();

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary.darkTeal} />
        <Text style={styles.loadingText}>Loading pomodoro data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Dev Pomodoro</Title>
      
      <Card style={styles.timerCard}>
        <Card.Content style={styles.timerContent}>
          <Text style={styles.sessionTitle}>{sessionTitle}</Text>
          <Text style={styles.sessionSubtitle}>{sessionSubtitle}</Text>
          
          <View style={styles.circularContainer}>
            <AnimatedCircularProgress
              size={250}
              width={12}
              fill={getProgress()}
              tintColor={isWork ? colors.primary.darkRed : colors.primary.gold}
              backgroundColor={colors.primary.lightYellow}
              rotation={0}
              lineCap="round"
            >
              {() => (
                <View style={styles.timerCenter}>
                  <Text style={styles.timerText}>
                    {formatTime(minutes, seconds)}
                  </Text>
                  <Text style={styles.timerLabel}>
                    {isWork ? '{ coding }' : '// break'}
                  </Text>
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
          
          <View style={styles.buttonRow}>
            <IconButton
              icon="refresh"
              size={30}
              iconColor={colors.primary.gold}
              style={[styles.actionButton, styles.resetButton]}
              onPress={resetTimer}
            />
            <IconButton
              icon={isActive ? 'pause' : 'play'}
              size={40}
              iconColor={colors.cardBackground}
              style={[styles.actionButton, styles.playButton]}
              onPress={toggleTimer}
            />
          </View>
        </Card.Content>
      </Card>

      <View style={styles.statsRow}>
        <Card style={[styles.statsCard, styles.todayCard]}>
          <Card.Content style={styles.statsContent}>
            <Text style={styles.statsNumber}>{stats.sessionsToday}</Text>
            <Text style={styles.statsLabel}>Sessions Today</Text>
            <Text style={styles.statsEmoji}>🚀</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statsCard, styles.totalCard]}>
          <Card.Content style={styles.statsContent}>
            <Text style={styles.statsNumber}>{stats.totalTime}</Text>
            <Text style={styles.statsLabel}>Total Minutes</Text>
            <Text style={styles.statsEmoji}>⏱️</Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.text.secondary,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: colors.primary.darkTeal,
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerCard: {
    marginBottom: 24,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
  },
  timerContent: {
    alignItems: 'center',
    padding: 20,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary.darkTeal,
    marginBottom: 4,
  },
  sessionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 30,
  },
  circularContainer: {
    marginBottom: 30,
  },
  timerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary.darkTeal,
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 8,
    fontFamily: 'monospace',
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    borderRadius: 50,
  },
  playButton: {
    backgroundColor: colors.primary.darkRed,
    width: 70,
    height: 70,
  },
  resetButton: {
    backgroundColor: colors.primary.lightYellow,
    width: 50,
    height: 50,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statsCard: {
    flex: 1,
    borderRadius: 16,
  },
  todayCard: {
    backgroundColor: colors.primary.gold,
  },
  totalCard: {
    backgroundColor: colors.primary.darkTeal,
  },
  statsContent: {
    alignItems: 'center',
    padding: 16,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.cardBackground,
    fontFamily: 'monospace',
  },
  statsLabel: {
    fontSize: 12,
    color: colors.cardBackground,
    textAlign: 'center',
    marginTop: 4,
  },
  statsEmoji: {
    fontSize: 20,
    marginTop: 8,
  },
});