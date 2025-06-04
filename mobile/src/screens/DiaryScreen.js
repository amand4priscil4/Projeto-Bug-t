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
  RadioButton
} from 'react-native-paper';
import { StorageService } from '../services/StorageService';
import { colors } from '../utils/colors';

export default function DiaryScreen() {
  const [entries, setEntries] = useState([]);
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

  // Salvar entradas sempre que mudarem
  useEffect(() => {
    if (entries.length > 0) {
      StorageService.saveDiary(entries);
    }
  }, [entries]);

  const loadEntries = async () => {
    const savedEntries = await StorageService.loadDiary();
    if (savedEntries.length === 0) {
      // Entradas iniciais se não houver dados salvos
      setEntries([
        {
          id: '1',
          date: '2025-06-04',
          title: 'React Native Development Setup',
          content: 'Today I configured a new React Native project with Expo. Learned about navigation patterns and implemented basic screen structure. The development experience is quite smooth with hot reload.',
          tags: ['React Native', 'Expo', 'Navigation'],
          mood: 'productive'
        },
        {
          id: '2',
          date: '2025-06-03',
          title: 'AsyncStorage Deep Dive',
          content: 'Studied local storage solutions for React Native. AsyncStorage is the go-to solution for persistent data. Implemented CRUD operations for task management.',
          tags: ['AsyncStorage', 'Storage', 'Mobile'],
          mood: 'focused'
        },
        {
          id: '3',
          date: '2025-06-02',
          title: 'UI Design Patterns',
          content: 'Explored modern UI patterns for mobile apps. React Native Paper provides excellent components. Color schemes and spacing are crucial for good UX.',
          tags: ['UI Design', 'React Native Paper', 'UX'],
          mood: 'creative'
        }
      ]);
    } else {
      setEntries(savedEntries);
    }
  };

  const addEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: 'New Learning Entry',
      content: 'Describe what you learned today...',
      tags: ['New', 'Learning'],
      mood: 'curious'
    };
    setEntries([newEntry, ...entries]);
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
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
    setEditMood('productive');
  };

  const saveEntry = () => {
    if (editingEntry && editTitle.trim() && editContent.trim()) {
      const updatedEntry = {
        ...editingEntry,
        title: editTitle.trim(),
        content: editContent.trim(),
        tags: editTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        mood: editMood
      };
      
      setEntries(entries.map(entry => 
        entry.id === editingEntry.id ? updatedEntry : entry
      ));
      closeEditModal();
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'productive': return colors.primary.darkTeal;
      case 'focused': return colors.primary.darkRed;
      case 'creative': return colors.primary.gold;
      case 'curious': return colors.primary.lightYellow;
      default: return colors.primary.gold;
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'productive': return '🚀';
      case 'focused': return '🎯';
      case 'creative': return '🎨';
      case 'curious': return '🤔';
      default: return '📝';
    }
  };

  const getMoodText = (mood) => {
    switch (mood) {
      case 'productive': return 'Productive';
      case 'focused': return 'Focused';
      case 'creative': return 'Creative';
      case 'curious': return 'Curious';
      default: return 'Productive';
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Tech Diary</Title>
        <View style={styles.statsContainer}>
          <View style={[styles.statChip, { backgroundColor: colors.primary.darkTeal }]}>
            <Text style={styles.statText}>{entries.length}</Text>
            <Text style={styles.statLabel}>Entries</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: colors.primary.gold }]}>
            <Text style={styles.statText}>📚</Text>
            <Text style={styles.statLabel}>Learning</Text>
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
            <Title style={styles.modalTitle}>Edit Entry</Title>
            
            <TextInput
              label="Entry Title"
              value={editTitle}
              onChangeText={setEditTitle}
              style={styles.textInput}
              mode="outlined"
              outlineColor={colors.primary.gold}
              activeOutlineColor={colors.primary.darkTeal}
            />

            <TextInput
              label="Content"
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
              label="Tags (separated by commas)"
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
                  value="productive" 
                  color={colors.primary.darkTeal}
                />
                <Text style={styles.radioText}>🚀 Productive</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton 
                  value="focused" 
                  color={colors.primary.darkRed}
                />
                <Text style={styles.radioText}>🎯 Focused</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton 
                  value="creative" 
                  color={colors.primary.gold}
                />
                <Text style={styles.radioText}>🎨 Creative</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton 
                  value="curious" 
                  color={colors.primary.gold}
                />
                <Text style={styles.radioText}>🤔 Curious</Text>
              </View>
            </RadioButton.Group>

            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={closeEditModal}
                style={styles.cancelButton}
                textColor={colors.text.secondary}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={saveEntry}
                style={styles.saveButton}
                buttonColor={colors.primary.darkTeal}
              >
                Save
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