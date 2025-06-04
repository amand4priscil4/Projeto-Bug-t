import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Text, IconButton } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { StorageService } from '../services/StorageService';
import { colors } from '../utils/colors';

export default function PomodoroScreen() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [stats, setStats] = useState({
    sessionsToday: 0,
    totalSessions: 0,
    timeToday: 0,
    totalTime: 0,
    lastDate: null
  });

  // Carregar estatísticas ao iniciar
  useEffect(() => {
    loadStats();
  }, []);

  // Salvar estatísticas sempre que mudarem
  useEffect(() => {
    StorageService.savePomodoroStats(stats);
  }, [stats]);

  const loadStats = async () => {
    const savedStats = await StorageService.loadPomodoroStats();
    const today = new Date().toDateString();

    if (savedStats.lastDate !== today) {
      setStats({
        ...savedStats,
        sessionsToday: 0,
        timeToday: 0,
        lastDate: today
      });
    } else {
      setStats(savedStats);
    }
  };

  const completeSession = () => {
    if (isWork) {
      setStats(prev => ({
        ...prev,
        sessionsToday: prev.sessionsToday + 1,
        totalSessions: prev.totalSessions + 1,
        timeToday: prev.timeToday + 25,
        totalTime: prev.totalTime + 25,
        lastDate: new Date().toDateString()
      }));
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

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    setIsWork(true);
    setInitialTime(25 * 60);
  };

  const formatTime = (min, sec) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const getCurrentTime = () => minutes * 60 + seconds;
  const getProgress = () => ((initialTime - getCurrentTime()) / initialTime) * 100;

  const getSessionText = () => {
    if (isWork) {
      return ['Coding Time', '⚡ Focus Mode'];
    } else {
      return ['Break Time', '☕ Debug Mode'];
    }
  };

  const [sessionTitle, sessionSubtitle] = getSessionText();

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
                  <Text style={styles.timerText}>{formatTime(minutes, seconds)}</Text>
                  <Text style={styles.timerLabel}>{isWork ? '{ coding }' : '// break'}</Text>
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
    padding: 16
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: colors.primary.darkTeal,
    fontSize: 24,
    fontWeight: 'bold'
  },
  timerCard: {
    marginBottom: 24,
    backgroundColor: colors.cardBackground,
    borderRadius: 20
  },
  timerContent: {
    alignItems: 'center',
    padding: 20
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary.darkTeal,
    marginBottom: 4
  },
  sessionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 30
  },
  circularContainer: {
    marginBottom: 30
  },
  timerCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary.darkTeal,
    fontFamily: 'monospace'
  },
  timerLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 8,
    fontFamily: 'monospace',
    fontStyle: 'italic'
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  actionButton: {
    borderRadius: 50
  },
  playButton: {
    backgroundColor: colors.primary.darkRed,
    width: 70,
    height: 70
  },
  resetButton: {
    backgroundColor: colors.primary.lightYellow,
    width: 50,
    height: 50
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16
  },
  statsCard: {
    flex: 1,
    borderRadius: 16
  },
  todayCard: {
    backgroundColor: colors.primary.gold
  },
  totalCard: {
    backgroundColor: colors.primary.darkTeal
  },
  statsContent: {
    alignItems: 'center',
    padding: 16
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.cardBackground,
    fontFamily: 'monospace'
  },
  statsLabel: {
    fontSize: 12,
    color: colors.cardBackground,
    textAlign: 'center',
    marginTop: 4
  },
  statsEmoji: {
    fontSize: 20,
    marginTop: 8
  }
});
