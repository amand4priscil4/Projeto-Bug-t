import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { 
  Card, 
  Title, 
  Text, 
  FAB, 
  IconButton, 
  Paragraph, 
  Chip,
  Modal,
  Portal,
  TextInput,
  Button,
  RadioButton,
  ActivityIndicator
} from 'react-native-paper';
import ApiService from '../services/ApiService';
import { colors } from '../utils/colors';

export default function DiaryScreen() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editMood, setEditMood] = useState('productive');

  // Carregar entradas ao iniciar
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getDiary();
      setEntries(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar diario:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async () => {
    try {
      const newEntryData = {
        title: 'Nova escrita de hoje',
        content: 'Descreva algo de interessante que você aprendeu hoje...',
        tags: ['New', 'Learning'],
        mood: 'curioso'
      };
      
      const response = await ApiService.createDiaryEntry(newEntryData);
      setEntries([response.data, ...entries]);
    } catch (error) {
      console.error('Erro ao criar entrada:', error);
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      await ApiService.deleteDiaryEntry(entryId);
      setEntries(entries.filter(entry => entry.id !== entryId));
    } catch (error) {
      console.error('Erro ao deletar entrada:', error);
    }
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setEditTitle(entry.title);
    setEditContent(entry.content);
    setEditTags(entry.tags.join(', '));
    setEditMood(entry.mood);
    setIsModalVisible(true);
  };

  const closeEditModal = () => {
    setIsModalVisible(false);
    setEditingEntry(null);
    setEditTitle('');
    setEditContent('');
    setEditTags('');
    setEditMood('produtivo');
  };

  const saveEntry = async () => {
    if (editingEntry && editTitle.trim() && editContent.trim()) {
      try {
        const updatedEntryData = {
          title: editTitle.trim(),
          content: editContent.trim(),
          tags: editTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
          mood: editMood
        };
        
        await ApiService.updateDiaryEntry(editingEntry.id, updatedEntryData);
        
        const updatedEntry = {
          ...editingEntry,
          ...updatedEntryData
        };
        
        setEntries(entries.map(entry => 
          entry.id === editingEntry.id ? updatedEntry : entry
        ));
        closeEditModal();
      } catch (error) {
        console.error('Erro ao salvar entrada:', error);
      }
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'produtivo': return colors.primary.darkTeal;
      case 'focado': return colors.primary.darkRed;
      case 'criativo': return colors.primary.gold;
      case 'curioso': return colors.primary.lightYellow;
      default: return colors.primary.gold;
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'produtivo': return '🚀';
      case 'focado': return '🎯';
      case 'criativo': return '🎨';
      case 'curioso': return '🤔';
      default: return '📝';
    }
  };

  const getMoodText = (mood) => {
    switch (mood) {
      case 'produtivo': return 'Productive';
      case 'focado': return 'Focused';
      case 'criativo': return 'Creative';
      case 'curioso': return 'Curious';
      default: return 'Produtivo';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderEntry = ({ item }) => (
    <Card style={styles.entryCard}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.entryHeader}>
          <View style={styles.entryInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
              <Title style={styles.entryTitle}>{item.title}</Title>
            </View>
            <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.entryActions}>
            <IconButton 
              icon="pencil-outline" 
              size={20} 
              iconColor={colors.primary.gold}
              onPress={() => openEditModal(item)} 
            />
            <IconButton 
              icon="delete-outline" 
              size={20} 
              iconColor={colors.primary.darkRed}
              onPress={() => deleteEntry(item.id)} 
            />
          </View>
        </View>
        
        <Paragraph style={styles.entryContent}>
          {item.content}
        </Paragraph>
        
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <Chip 
              key={index} 
              style={[styles.tag, { backgroundColor: getMoodColor(item.mood) }]}
              textStyle={styles.tagText}
            >
              #{tag}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary.darkTeal} />
        <Text style={styles.loadingText}>Carregando entradas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Tech Diário</Title>
        <View style={styles.statsContainer}>
          <View style={[styles.statChip, { backgroundColor: colors.primary.darkTeal }]}>
            <Text style={styles.statText}>{entries.length}</Text>
            <Text style={styles.statLabel}>Entradas</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: colors.primary.gold }]}>
            <Text style={styles.statText}>📚</Text>
            <Text style={styles.statLabel}>Leituras</Text>
          </View>
        </View>
      </View>
      
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        color={colors.cardBackground}
        onPress={addEntry}
      />

      {/* Modal de Edição */}
      <Portal>
        <Modal 
          visible={isModalVisible} 
          onDismiss={closeEditModal}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView style={styles.modalContent}>
            <Title style={styles.modalTitle}>Editar entrada</Title>
            
            <TextInput
              label="Título"
              value={editTitle}
              onChangeText={setEditTitle}
              style={styles.textInput}
              mode="outlined"
              outlineColor={colors.primary.gold}
              activeOutlineColor={colors.primary.darkTeal}
            />

            <TextInput
              label="Conteúdo"
              value={editContent}
              onChangeText={setEditContent}
              style={styles.textAreaInput}
              mode="outlined"
              multiline
              numberOfLines={4}
              outlineColor={colors.primary.gold}
              activeOutlineColor={colors.primary.darkTeal}
            />

            <TextInput
              label="Tags (Separe por vígulas)"
              value={editTags}
              onChangeText={setEditTags}
              style={styles.textInput}
              mode="outlined"
              placeholder="React Native, Learning, Development"
              outlineColor={colors.primary.gold}
              activeOutlineColor={colors.primary.darkTeal}
            />

            <Text style={styles.moodLabel}>Mood</Text>
            <RadioButton.Group 
              onValueChange={setEditMood} 
              value={editMood}
            >
              <View style={styles.radioOption}>
                <RadioButton 
                  value="produtivo" 
                  color={colors.primary.darkTeal}
                />
                <Text style={styles.radioText}>🚀 Produtivo</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton 
                  value="focado" 
                  color={colors.primary.darkRed}
                />
                <Text style={styles.radioText}>🎯 Focado</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton 
                  value="criativo" 
                  color={colors.primary.gold}
                />
                <Text style={styles.radioText}>🎨 Criativo</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton 
                  value="curioso" 
                  color={colors.primary.gold}
                />
                <Text style={styles.radioText}>🤔 Curioso</Text>
              </View>
            </RadioButton.Group>

            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={closeEditModal}
                style={styles.cancelButton}
                textColor={colors.text.secondary}
              >
                Cancelar
              </Button>
              <Button 
                mode="contained" 
                onPress={saveEntry}
                style={styles.saveButton}
                buttonColor={colors.primary.darkTeal}
              >
                Salvar
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
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
  header: {
    padding: 25,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary.darkTeal,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  statChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 80,
  },
  statText: {
    color: colors.cardBackground,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.cardBackground,
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 25,
    paddingBottom: 100,
  },
  entryCard: {
    marginBottom: 20,
    borderRadius: 20,
    elevation: 4,
    backgroundColor: colors.cardBackground,
  },
  cardContent: {
    padding: 20,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  entryInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary.darkTeal,
    flex: 1,
  },
  entryDate: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  entryActions: {
    flexDirection: 'row',
  },
  entryContent: {
    marginBottom: 18,
    lineHeight: 22,
    fontSize: 15,
    color: colors.text.primary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: 16,
  },
  tagText: {
    color: colors.cardBackground,
    fontSize: 11,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 25,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary.darkRed,
    borderRadius: 30,
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    justifyContent: 'center',
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 25,
    maxHeight: '100%',
  },
  modalTitle: {
    textAlign: 'center',
    color: colors.primary.darkTeal,
    marginBottom: 20,
    fontSize: 22,
  },
  textInput: {
    marginBottom: 15,
    backgroundColor: colors.cardBackground,
  },
  textAreaInput: {
    marginBottom: 15,
    backgroundColor: colors.cardBackground,
    minHeight: 100,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary.darkTeal,
    marginBottom: 15,
    marginTop: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    borderColor: colors.text.secondary,
  },
  saveButton: {
    flex: 1,
  },
});