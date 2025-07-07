export interface Card {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
  color: string;
}

export interface KanbanState {
  columns: Column[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addColumn: (title: string, color: string) => void;
  removeColumn: (columnId: string) => void;
  updateColumn: (columnId: string, updates: Partial<Column>) => void;
  addCard: (columnId: string, card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeCard: (cardId: string) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void;
  reorderCards: (columnId: string, oldIndex: number, newIndex: number) => void;
}