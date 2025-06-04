import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { 
  Card, 
  Checkbox, 
  Text, 
  FAB, 
  IconButton, 
  Title, 
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

export default function ChecklistScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState('média');

  // Carregar tarefas ao iniciar
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = { ...task, completed: !task.completed };
      
      await ApiService.updateTask(taskId, updatedTask);
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await ApiService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  const addTask = async () => {
    try {
      const newTaskData = {
        title: 'Nova tarefa do desenvolvedor',
        priority: 'média'
      };
      
      const response = await ApiService.createTask(newTaskData);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setIsModalVisible(true);
  };

  const closeEditModal = () => {
    setIsModalVisible(false);
    setEditingTask(null);
    setEditTitle('');
    setEditPriority('média');
  };

  const saveTask = async () => {
    if (editingTask && editTitle.trim()) {
      try {
        const updatedTaskData = {
          ...editingTask,
          title: editTitle.trim(),
          priority: editPriority
        };
        
        await ApiService.updateTask(editingTask.id, updatedTaskData);
        setTasks(tasks.map(task => 
          task.id === editingTask.id ? updatedTaskData : task
        ));
        closeEditModal();
      } catch (error) {
        console.error('Erro ao salvar tarefa:', error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'leve': return colors.primary.darkRed;
      case 'média': return colors.primary.gold;
      case 'urgente': return colors.primary.darkTeal;
      default: return colors.primary.gold;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'leve': return 'leve';
      case 'média': return 'média';
      case 'urgente': return 'urgente';
      default: return 'Média';
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const renderTask = ({ item }) => (
    <Card style={[
      styles.taskCard, 
      item.completed && styles.completedCard
    ]}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.taskRow}>
          <Checkbox
            status={item.completed ? 'checked' : 'unchecked'}
            onPress={() => toggleTask(item.id)}
            color={colors.primary.darkTeal}
          />
          <View style={styles.taskInfo}>
            <Text style={[
              styles.taskText, 
              item.completed && styles.completedTask
            ]}>
              {item.title}
            </Text>
            <Chip 
              style={[styles.priorityChip, { backgroundColor: getPriorityColor(item.priority) }]}
              textStyle={styles.chipText}
            >
              {getPriorityText(item.priority)}
            </Chip>
          </View>
          <View style={styles.taskActions}>
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
              onPress={() => deleteTask(item.id)} 
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary.darkTeal} />
        <Text style={styles.loadingText}>Carregando tarefas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Dev tarefas</Title>
        <View style={styles.statsContainer}>
          <View style={[styles.statChip, { backgroundColor: colors.primary.darkTeal }]}>
            <Text style={styles.statText}>{completedTasks}/{totalTasks}</Text>
            <Text style={styles.statLabel}>Completas</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: colors.primary.gold }]}>
            <Text style={styles.statText}>{totalTasks - completedTasks}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
        </View>
      </View>
      
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        color={colors.cardBackground}
        onPress={addTask}
      />

      {/* Modal de Edição */}
      <Portal>
        <Modal 
          visible={isModalVisible} 
          onDismiss={closeEditModal}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Title style={styles.modalTitle}>Editar tarefas</Title>
            
            <TextInput
              label="Título"
              value={editTitle}
              onChangeText={setEditTitle}
              style={styles.textInput}
              mode="outlined"
              outlineColor={colors.primary.gold}
              activeOutlineColor={colors.primary.darkTeal}
            />

            <Text style={styles.priorityLabel}>Prioridade</Text>
            <RadioButton.Group 
              onValueChange={setEditPriority} 
              value={editPriority}
            >
              <View style={styles.radioOption}>
                <RadioButton 
                  value="Leve" 
                  color={colors.primary.darkRed}
                />
                <Text style={styles.radioText}>Leve</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton 
                  value="média" 
                  color={colors.primary.gold}
                />
                <Text style={styles.radioText}>Média</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton 
                  value="Urgente" 
                  color={colors.primary.darkTeal}
                />
                <Text style={styles.radioText}>Urgente</Text>
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
                onPress={saveTask}
                style={styles.saveButton}
                buttonColor={colors.primary.darkTeal}
              >
                Salvar
              </Button>
            </View>
          </View>
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
  taskCard: {
    marginBottom: 15,
    borderRadius: 18,
    elevation: 3,
    backgroundColor: colors.cardBackground,
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: colors.primary.lightYellow,
  },
  cardContent: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  taskInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  taskText: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 8,
    lineHeight: 22,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
    color: colors.primary.darkTeal,
  },
  priorityChip: {
    alignSelf: 'flex-start',
  },
  chipText: {
    color: colors.cardBackground,
    fontSize: 11,
    fontWeight: 'bold',
  },
  taskActions: {
    flexDirection: 'row',
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
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 25,
  },
  modalTitle: {
    textAlign: 'center',
    color: colors.primary.darkTeal,
    marginBottom: 20,
    fontSize: 22,
  },
  textInput: {
    marginBottom: 20,
    backgroundColor: colors.cardBackground,
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary.darkTeal,
    marginBottom: 15,
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