import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { kanbanApi } from '../__fake-api__/kanban-api';
import type { AppThunk } from '../store';
import type { Board, Card, CheckItem, Checklist, Column, Comment, Member } from '../types/kanban';
import { objFromArray } from '../utils/obj-from-array';

interface KanbanState {
  isLoaded: boolean;
  columns: {
    byId: Record<string, Column>;
    allIds: string[];
  };
  cards: {
    byId: Record<string, Card>;
    allIds: string[];
  };
  members: {
    byId: Record<string, Member>;
    allIds: string[];
  };
}

const initialState: KanbanState = {
  isLoaded: false,
  columns: {
    byId: {},
    allIds: []
  },
  cards: {
    byId: {},
    allIds: []
  },
  members: {
    byId: {},
    allIds: []
  }
};

const slice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    getBoard(
      state: KanbanState,
      action: PayloadAction<Board>
    ): void {
      const board = action.payload;

      state.columns.byId = objFromArray(board.columns);
      state.columns.allIds = Object.keys(state.columns.byId);
      state.cards.byId = objFromArray(board.cards);
      state.cards.allIds = Object.keys(state.cards.byId);
      state.members.byId = objFromArray(board.members);
      state.members.allIds = Object.keys(state.members.byId);
      state.isLoaded = true;
    },
    createColumn(
      state: KanbanState,
      action: PayloadAction<Column>
    ): void {
      const column = action.payload;

      state.columns.byId[column.id] = column;
      state.columns.allIds.push(column.id);
    },
    updateColumn(
      state: KanbanState,
      action: PayloadAction<Column>
    ): void {
      const column = action.payload;

      state.columns.byId[column.id] = column;
    },
    clearColumn(
      state: KanbanState,
      action: PayloadAction<string>
    ): void {
      const columnId = action.payload;

      // cardIds to be removed
      const { cardIds } = state.columns.byId[columnId];

      // Delete the cardIds references from the column
      state.columns.byId[columnId].cardIds = [];

      // Delete the cards from state
      cardIds.forEach((cardId) => {
        delete state.cards.byId[cardId];
      });

      state.cards.allIds = state.cards.allIds.filter((cardId) => cardIds.includes(cardId));
    },
    deleteColumn(
      state: KanbanState,
      action: PayloadAction<string>
    ): void {
      const columnId = action.payload;

      delete state.columns.byId[columnId];
      state.columns.allIds = state.columns.allIds.filter((_listId) => _listId !== columnId);
    },
    createCard(
      state: KanbanState,
      action: PayloadAction<Card>
    ): void {
      const card = action.payload;

      state.cards.byId[card.id] = card;
      state.cards.allIds.push(card.id);

      // Add the cardId reference to the column
      state.columns.byId[card.columnId].cardIds.push(card.id);
    },
    updateCard(
      state: KanbanState,
      action: PayloadAction<Card>
    ): void {
      const card = action.payload;

      Object.assign(state.cards.byId[card.id], card);
    },
    moveCard(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; position: number; columnId?: string }>
    ): void {
      const { cardId, position, columnId } = action.payload;
      const sourceColumnId = state.cards.byId[cardId].columnId;

      // Remove card from source column
      state.columns.byId[sourceColumnId].cardIds = (
        state.columns.byId[sourceColumnId].cardIds.filter((_cardId) => _cardId !== cardId)
      );

      // If columnId exists, it means that we have to add the card to the new column
      if (columnId) {
        // Change card's columnId reference
        state.cards.byId[cardId].columnId = columnId;
        // Push the cardId to the specified position
        state.columns.byId[columnId].cardIds.splice(position, 0, cardId);
      } else {
        // Push the cardId to the specified position
        state.columns.byId[sourceColumnId].cardIds.splice(position, 0, cardId);
      }
    },
    deleteCard(
      state: KanbanState,
      action: PayloadAction<string>
    ): void {
      const cardId = action.payload;
      const { columnId } = state.cards.byId[cardId];

      delete state.cards.byId[cardId];
      state.cards.allIds = state.cards.allIds.filter((_cardId) => _cardId !== cardId);
      state.columns.byId[columnId].cardIds = (
        state.columns.byId[columnId].cardIds.filter((_cardId) => _cardId !== cardId)
      );
    },
    addComment(
      state: KanbanState,
      action: PayloadAction<Comment>
    ): void {
      const comment = action.payload;
      const card = state.cards.byId[comment.cardId];

      card.comments.push(comment);
    },
    addChecklist(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; checklist: Checklist }>
    ): void {
      const { cardId, checklist } = action.payload;
      const card = state.cards.byId[cardId];

      card.checklists.push(checklist);
    },
    updateChecklist(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; checklist: Checklist }>
    ): void {
      const { cardId, checklist } = action.payload;
      const card = state.cards.byId[cardId];

      card.checklists = card.checklists.map((_checklist) => {
        if (_checklist.id === checklist.id) {
          return checklist;
        }

        return _checklist;
      });
    },
    deleteChecklist(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; checklistId: string }>
    ): void {
      const { cardId, checklistId } = action.payload;
      const card = state.cards.byId[cardId];

      card.checklists = card.checklists.filter((checklist) => checklist.id !== checklistId);
    },
    addCheckItem(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; checklistId: string; checkItem: CheckItem }>
    ): void {
      const { cardId, checklistId, checkItem } = action.payload;
      const card = state.cards.byId[cardId];
      const checklist = card.checklists.find((_checklist) => _checklist.id === checklistId);

      checklist.checkItems.push(checkItem);
    },
    updateCheckItem(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; checklistId: string; checkItem: CheckItem }>
    ): void {
      const {
        cardId,
        checklistId,
        checkItem
      } = action.payload;
      const card = state.cards.byId[cardId];
      const checklist = card.checklists.find((_checklist) => _checklist.id === checklistId);

      checklist.checkItems = checklist.checkItems.map((_checkItem) => {
        if (_checkItem.id === checkItem.id) {
          return checkItem;
        }

        return _checkItem;
      });
    },
    deleteCheckItem(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; checklistId: string; checkItemId: string }>
    ): void {
      const { cardId, checklistId, checkItemId } = action.payload;
      const card = state.cards.byId[cardId];
      const checklist = card.checklists.find((_checklist) => _checklist.id === checklistId);

      checklist.checkItems = (
        checklist.checkItems.filter((checkItem) => checkItem.id !== checkItemId)
      );
    }
  }
});

export const { reducer } = slice;

export const getBoard = (): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.getBoard();

  dispatch(slice.actions.getBoard(data));
};

export const createColumn = (name: string): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.createColumn({ name });

  dispatch(slice.actions.createColumn(data));
};

export const updateColumn = (
  columnId: string,
  update: any
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.updateColumn({ columnId, update });

  dispatch(slice.actions.updateColumn(data));
};

export const clearColumn = (columnId: string): AppThunk => async (dispatch): Promise<void> => {
  await kanbanApi.clearColumn(columnId);

  dispatch(slice.actions.clearColumn(columnId));
};

export const deleteColumn = (columnId: string): AppThunk => async (dispatch): Promise<void> => {
  await kanbanApi.deleteColumn(columnId);

  dispatch(slice.actions.deleteColumn(columnId));
};

export const createCard = (
  columnId: string,
  name: string
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.createCard({ columnId, name });

  dispatch(slice.actions.createCard(data));
};

export const updateCard = (
  cardId: string,
  update: any
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.updateCard({ cardId, update });

  dispatch(slice.actions.updateCard(data));
};

export const moveCard = (
  cardId: string,
  position: number,
  columnId?: string
): AppThunk => async (dispatch): Promise<void> => {
  await kanbanApi.moveCard({ cardId, position, columnId });

  dispatch(slice.actions.moveCard({
    cardId,
    position,
    columnId
  }));
};

export const deleteCard = (cardId: string): AppThunk => async (dispatch): Promise<void> => {
  await kanbanApi.deleteCard(cardId);

  dispatch(slice.actions.deleteCard(cardId));
};

export const addComment = (
  cardId: string,
  message: string
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.addComment({ cardId, message });

  dispatch(slice.actions.addComment(data));
};

export const addChecklist = (
  cardId: string,
  name: string
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.addChecklist({ cardId, name });

  dispatch(slice.actions.addChecklist({
    cardId,
    checklist: data
  }));
};

export const updateChecklist = (
  cardId: string,
  checklistId: string,
  update: any
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.updateChecklist({ cardId, checklistId, update });

  dispatch(slice.actions.updateChecklist({
    cardId,
    checklist: data
  }));
};

export const deleteChecklist = (
  cardId: string,
  checklistId: string
): AppThunk => async (dispatch): Promise<void> => {
  await kanbanApi.deleteChecklist({ cardId, checklistId });

  dispatch(slice.actions.deleteChecklist({
    cardId,
    checklistId
  }));
};

export const addCheckItem = (
  cardId: string,
  checklistId: string,
  name: string
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.addCheckItem({ cardId, checklistId, name });

  dispatch(slice.actions.addCheckItem({
    cardId,
    checklistId,
    checkItem: data
  }));
};

export const updateCheckItem = (
  cardId: string,
  checklistId: string,
  checkItemId: string,
  update: any
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.updateCheckItem({ cardId, checklistId, checkItemId, update });

  dispatch(slice.actions.updateCheckItem({
    cardId,
    checklistId,
    checkItem: data
  }));
};

export const deleteCheckItem = (
  cardId: string,
  checklistId: string,
  checkItemId: string
): AppThunk => async (dispatch): Promise<void> => {
  await kanbanApi.deleteCheckItem({ cardId, checklistId, checkItemId });

  dispatch(slice.actions.deleteCheckItem({
    cardId,
    checklistId,
    checkItemId
  }));
};
