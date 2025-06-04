import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Card, Title, Text, Avatar, ActivityIndicator } from 'react-native-paper';
import ApiService from '../services/ApiService';
import { colors } from '../utils/colors';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    tasks: 0,
    completedTasks: 0,
    pomodoroSessions: 0,
    diaryEntries: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Fazer todas as chamadas da API em paralelo
      const [tasksResponse, diaryResponse, pomodoroResponse] = await Promise.all([
        ApiService.getTasks(),
        ApiService.getDiary(),
        ApiService.getTodayStats()
      ]);
      
      const tasks = tasksResponse.data || [];
      const diary = diaryResponse.data || [];
      const todayStats = pomodoroResponse.data || {};
      
      setStats({
        tasks: tasks.length,
        completedTasks: tasks.filter(task => task.completed).length,
        pomodoroSessions: todayStats.sessions || 0,
        diaryEntries: diary.length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary.darkTeal} />
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoSpace}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bem vindx,</Text>
          <Title style={styles.userName}>Desenvolvedxr!</Title>
        </View>
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.topRow}>
          <Card style={[styles.card, styles.leftCard, { backgroundColor: colors.primary.darkRed }]}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>📝</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>Tarefas</Text>
              <Avatar.Text 
                size={30} 
                label={stats.tasks.toString()} 
                style={styles.cardAvatar}
                labelStyle={styles.avatarLabel}
              />
              <Text style={styles.cardSubtitle}>
                {stats.completedTasks}/{stats.tasks} completas
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.card, styles.rightCard, { backgroundColor: colors.primary.gold }]}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>⏱</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>Foco</Text>
              <Avatar.Text 
                size={30} 
                label={stats.pomodoroSessions.toString()} 
                style={styles.cardAvatar}
                labelStyle={styles.avatarLabel}
              />
              <Text style={styles.cardSubtitle}>Sessões de hoje</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.bottomRow}>
          <Card style={[styles.card, styles.leftCard, { backgroundColor: colors.primary.lightYellow }]}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Text style={[styles.cardIcon, { color: colors.primary.darkTeal }]}>💻</Text>
                </View>
              </View>
              <Text style={[styles.cardTitle, { color: colors.primary.darkTeal }]}>
                Debug
              </Text>
              <Avatar.Text 
                size={30} 
                label="0" 
                style={[styles.cardAvatar, { backgroundColor: colors.primary.darkTeal }]}
                labelStyle={styles.avatarLabel}
              />
              <Text style={[styles.cardSubtitle, { color: colors.primary.darkTeal }]}>
                Bugs fixos de hoje
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.card, styles.rightCard, { backgroundColor: colors.primary.darkTeal }]}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>📚</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>Diário</Text>
              <Avatar.Text 
                size={30} 
                label={stats.diaryEntries.toString()} 
                style={styles.cardAvatar}
                labelStyle={styles.avatarLabel}
              />
              <Text style={styles.cardSubtitle}>Diário de bordo</Text>
            </Card.Content>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.text.secondary,
  },
  logoSpace: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
    marginBottom: 40,
  },
  greeting: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary.darkTeal,
    marginTop: -5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addButton: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  lessonButton: {
    backgroundColor: colors.primary.darkRed,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
  },
  lessonText: {
    color: colors.cardBackground,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardsContainer: {
    paddingHorizontal: 25,
    paddingBottom: 30,
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 20,
  },
  card: {
    borderRadius: 28,
    elevation: 4,
  },
  leftCard: {
    flex: 1.3,
    height: 200,
  },
  rightCard: {
    flex: 1,
    height: 200,
  },
  cardContent: {
    padding: 25,
    height: '100%',
    justifyContent: 'space-between',
  },
  cardHeader: {
    alignItems: 'flex-end',
  },
  cardIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 24,
    color: colors.cardBackground,
  },
  cardTitle: {
    color: colors.cardBackground,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  cardAvatar: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginTop: 12,
  },
  avatarLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.cardBackground,
  },
  cardSubtitle: {
    color: colors.cardBackground,
    fontSize: 14,
    opacity: 0.9,
    marginTop: 8,
  },
});