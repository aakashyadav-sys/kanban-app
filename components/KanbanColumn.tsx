import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import  Icons  from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Column } from '../types/kanban';
import { useKanbanStore } from '../store/kanbanStore';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  column: Column;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newCardPriority, setNewCardPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  const { addCard, removeColumn } = useKanbanStore();
  
  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCard(column.id, {
        title: newCardTitle.trim(),
        description: newCardDescription.trim() || undefined,
        priority: newCardPriority,
      });
      setNewCardTitle('');
      setNewCardDescription('');
      setNewCardPriority('medium');
      setIsAddingCard(false);
    }
  };
  
  const handleCancel = () => {
    setNewCardTitle('');
    setNewCardDescription('');
    setNewCardPriority('medium');
    setIsAddingCard(false);
  };
  
  const handleDeleteColumn = () => {
    Alert.alert(
      'Delete Column',
      `Are you sure you want to delete "${column.title}" and all its cards?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeColumn(column.id) },
      ]
    );
    setShowMenu(false);
  };
  
  return (
    <>
      <View style={styles.column}>
        <View style={styles.columnHeader}>
          <View style={styles.columnTitleContainer}>
            <View style={[styles.colorIndicator, { backgroundColor: column.color }]} />
            <Text style={styles.columnTitle}>{column.title}</Text>
            <View style={styles.cardCount}>
              <Text style={styles.cardCountText}>{column.cards.length}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.menuButton}>
            <FontAwesomeIcon name="ellipsis-v"    size={15} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.cardsContainer} showsVerticalScrollIndicator={false}>
          {column.cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </ScrollView>
        
        <TouchableOpacity
          style={styles.addCardButton}
          onPress={() => setIsAddingCard(true)}
        >
          <Icons name="plus" size={20} color="#6B7280" />
          <Text style={styles.addCardText}>Add a card</Text>
        </TouchableOpacity>
      </View>
      
      <Modal visible={isAddingCard} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Card</Text>
            <TouchableOpacity onPress={handleCancel}>
              <Icons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.textInput}
                value={newCardTitle}
                onChangeText={setNewCardTitle}
                placeholder="Enter card title"
                multiline
                autoFocus
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newCardDescription}
                onChangeText={setNewCardDescription}
                placeholder="Description (optional)"
                multiline
                numberOfLines={4}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.prioritySelector}>
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      newCardPriority === priority && styles.priorityOptionSelected
                    ]}
                    onPress={() => setNewCardPriority(priority)}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      newCardPriority === priority && styles.priorityOptionTextSelected
                    ]}>
                      {priority === 'low' ? '🟢' : priority === 'medium' ? '🟡' : '🔴'} {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddCard}>
                <Text style={styles.saveButtonText}>Add Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <Modal visible={showMenu} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          onPress={() => setShowMenu(false)}
          activeOpacity={1}
        >
          <View style={styles.menuModal}>
            <TouchableOpacity style={styles.menuItem} onPress={handleDeleteColumn}>
              <Icons name="delete" size={20} color="#EF4444" />
              <Text style={styles.menuItemTextDanger}>Delete Column</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  column: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    width: 280,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: '100%',
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  columnTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  cardCount: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  cardCountText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  menuButton: {
    padding: 4,
  },
  cardsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  addCardText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  priorityOptionText: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  priorityOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuModal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  menuItemTextDanger: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 12,
    fontWeight: '500',
  },
});