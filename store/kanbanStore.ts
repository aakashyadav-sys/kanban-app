import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KanbanState, Column, Card } from '../types/kanban';

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialColumns: Column[] = [
  {
    id: generateId(),
    title: 'To Do',
    color: '#3B82F6',
    cards: [
      {
        id: generateId(),
        title: 'Design Mobile UI',
        description: 'Create wireframes and mockups for the mobile app',
        priority: 'high',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Setup Navigation',
        description: 'Configure React Navigation',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: generateId(),
    title: 'In Progress',
    color: '#EAB308',
    cards: [
      {
        id: generateId(),
        title: 'API Integration',
        description: 'Connect mobile app with backend services',
        priority: 'high',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: generateId(),
    title: 'Review',
    color: '#8B5CF6',
    cards: [],
  },
  {
    id: generateId(),
    title: 'Done',
    color: '#10B981',
    cards: [
      {
        id: generateId(),
        title: 'Project Setup',
        description: 'Initialize React Native project with Expo',
        priority: 'low',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

interface KanbanStateWithHydration extends KanbanState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useKanbanStore = create<KanbanStateWithHydration>()(
  persist(
    (set, get) => ({
      columns: initialColumns,
      _hasHydrated: false,
      
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state
        });
      },
      
      addColumn: (title: string, color: string) => {
        const newColumn: Column = {
          id: generateId(),
          title,
          color,
          cards: [],
        };
        set((state) => ({
          columns: [...state.columns, newColumn],
        }));
      },
      
      removeColumn: (columnId: string) => {
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== columnId),
        }));
      },
      
      updateColumn: (columnId: string, updates: Partial<Column>) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId ? { ...col, ...updates } : col
          ),
        }));
      },
      
      addCard: (columnId: string, cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newCard: Card = {
          ...cardData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? { ...col, cards: [...col.cards, newCard] }
              : col
          ),
        }));
      },
      
      removeCard: (cardId: string) => {
        set((state) => ({
          columns: state.columns.map((col) => ({
            ...col,
            cards: col.cards.filter((card) => card.id !== cardId),
          })),
        }));
      },
      
      updateCard: (cardId: string, updates: Partial<Card>) => {
        set((state) => ({
          columns: state.columns.map((col) => ({
            ...col,
            cards: col.cards.map((card) =>
              card.id === cardId
                ? { ...card, ...updates, updatedAt: new Date().toISOString() }
                : card
            ),
          })),
        }));
      },
      
      moveCard: (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
        const { columns } = get();
        const fromColumn = columns.find(col => col.id === fromColumnId);
        const toColumn = columns.find(col => col.id === toColumnId);
        
        if (!fromColumn || !toColumn) return;
        
        const card = fromColumn.cards.find(c => c.id === cardId);
        if (!card) return;
        
        set((state) => ({
          columns: state.columns.map((col) => {
            if (col.id === fromColumnId) {
              return {
                ...col,
                cards: col.cards.filter(c => c.id !== cardId),
              };
            }
            if (col.id === toColumnId) {
              const newCards = [...col.cards];
              newCards.splice(newIndex, 0, card);
              return {
                ...col,
                cards: newCards,
              };
            }
            return col;
          }),
        }));
      },
      
      reorderCards: (columnId: string, oldIndex: number, newIndex: number) => {
        set((state) => ({
          columns: state.columns.map((col) => {
            if (col.id === columnId) {
              const newCards = [...col.cards];
              const [movedCard] = newCards.splice(oldIndex, 1);
              newCards.splice(newIndex, 0, movedCard);
              return { ...col, cards: newCards };
            }
            return col;
          }),
        }));
      },
    }),
    {
      name: 'kanban-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);